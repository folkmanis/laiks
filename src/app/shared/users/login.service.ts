import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User, updateProfile
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
import { PermissionsService } from '@shared/permissions';
import { throwIfNull, WithId } from '@shared/utils';
import {
  EMPTY,
  first,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { defaultUser, LaiksUser } from './laiks-user';

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

  createEmailAccount(
    email: string,
    password: string,
    name: string
  ): Observable<LaiksUser> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      mergeMap((userCredentials) => updateProfile(userCredentials.user, { displayName: name })),
      map(() => this.auth.currentUser),
      throwIfNull(),
      mergeMap((user) =>
        this.createLaiksUser({ ...user, displayName: name })
      )
    );
  }

  deleteAccount(): Observable<void> {
    const user = this.auth.currentUser;
    if (user) {
      return from(user.delete());
    } else {
      return EMPTY;
    }
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
          return docData(docRef, { idField: 'id' }).pipe(throwIfNull(user.uid));
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
    return this.laiksUser().pipe(
      switchMap((user) =>
        user ? this.permissionsService.isAdmin(user.id) : of(false)
      )
    );
  }

  isNpAllowed(): Observable<boolean> {
    return this.laiksUser().pipe(
      switchMap((user) =>
        user ? this.permissionsService.isNpBlocked(user.id) : of(true)
      ),
      map((blocked) => !blocked)
    );
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
