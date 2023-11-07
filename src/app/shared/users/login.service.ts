import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  EmailAuthCredential,
  signInWithPopup,
  signOut,
  User,
  AuthProvider,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  deleteUser,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { throwIfNull, WithId } from '@shared/utils';
import { first, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { defaultUser, LaiksUser } from './laiks-user';
import {
  PermissionsService,
  Permissions,
  DEFAULT_PERMISSIONS,
} from '@shared/permissions';

export enum LoginResponseType {
  CREATED,
  EXISTING,
}

export interface LoginResponse {
  type: LoginResponseType;
  laiksUser: LaiksUser;
}

const USERS = 'users';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private permissionsService = inject(PermissionsService);

  isLogin = (): Observable<boolean> =>
    this.getUser().pipe(map((user) => !!user));

  getUser(): Observable<User | null> {
    return authState(this.auth);
  }

  loginWithGmail(): Observable<LoginResponse> {
    const authProvider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, authProvider)).pipe(
      switchMap(({ user }) =>
        this.getLaiksUserSnapshot(user).pipe(
          mergeMap((laiksUser) =>
            laiksUser
              ? of({ type: LoginResponseType.EXISTING, laiksUser })
              : this.createLaiksUser(user).pipe(
                  map((u) => ({
                    type: LoginResponseType.CREATED,
                    laiksUser: u,
                  }))
                )
          )
        )
      )
    );
  }

  loginWithEmail(email: string, password: string): Observable<LaiksUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => this.getLaiksUserSnapshot(user)),
      mergeMap((laiksUser) => this.deleteUserIfNotRegistered(laiksUser))
    );
  }

  createEmailAccount(email: string, password: string, name: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      mergeMap((user) =>
        this.createLaiksUser({ ...user.user, displayName: name })
      )
    );
  }

  logout() {
    signOut(this.auth);
  }

  laiksUser(): Observable<WithId<LaiksUser> | null> {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        } else {
          const docRef = doc(
            this.firestore,
            USERS,
            user.uid
          ) as DocumentReference<WithId<LaiksUser>>;
          return docData(docRef, { idField: 'id' });
        }
      })
    );
  }

  getUserProperty<T extends keyof LaiksUser>(key: T): Observable<LaiksUser[T]> {
    return this.laiksUser().pipe(
      throwIfNull(),
      map((user) => user[key])
    );
  }

  getVatFn(): Observable<(val: number) => number> {
    return this.laiksUser().pipe(
      throwIfNull(),
      map((user) =>
        user.includeVat
          ? (val: number) => val * (1 + user.vatAmount)
          : (val: number) => val
      )
    );
  }

  updateLaiksUser(update: Partial<LaiksUser>) {
    return this.getUser().pipe(
      first(),
      throwIfNull(),
      map((user) => doc(this.firestore, USERS, user.uid)),
      mergeMap((docRef) => updateDoc(docRef, update))
    );
  }

  isAdmin(): Observable<boolean> {
    return this.getPermissions().pipe(map((data) => data.admin));
  }

  isNpAllowed(): Observable<boolean> {
    return this.getPermissions().pipe(map((data) => data.npUser));
  }

  private getLaiksUserSnapshot(user: User): Observable<LaiksUser | undefined> {
    const docRef = doc(
      this.firestore,
      USERS,
      user.uid
    ) as DocumentReference<LaiksUser>;

    return from(getDoc(docRef)).pipe(map((snapshot) => snapshot.data()));
  }

  private createLaiksUser(user: User): Observable<LaiksUser> {
    if (!user.email || !user.displayName) {
      throw new Error('Missing email or name');
    }

    const docRef = doc(
      this.firestore,
      USERS,
      user.uid
    ) as DocumentReference<LaiksUser>;

    const laiksUser = defaultUser(user.email, user.displayName);

    return from(setDoc(docRef, laiksUser)).pipe(map(() => laiksUser));
  }

  private getPermissions(): Observable<Permissions> {
    return this.getUser().pipe(
      map((user) => user?.uid),
      switchMap((id) =>
        id
          ? this.permissionsService.getPermissions(id)
          : of(DEFAULT_PERMISSIONS)
      )
    );
  }

  private deleteUserIfNotRegistered(
    laiksUser: LaiksUser | undefined
  ): Observable<LaiksUser | never> {
    return laiksUser
      ? of(laiksUser)
      : from(
          deleteUser(this.auth.currentUser!).then(() => {
            throw new Error('User not registered');
          })
        );
  }
}
