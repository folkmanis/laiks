import { inject, Injectable } from '@angular/core';
import { Auth, authState, docData, Firestore } from '@shared/firebase';
import { PriceCalculatorService } from '@shared/np-data';
import { PermissionsService } from '@shared/permissions';
import { assertNotNull, throwIfNull, WithId } from '@shared/utils';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  firstValueFrom,
  map,
  Observable,
  of,
  shareReplay,
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
  private priceCalculatorService = inject(PriceCalculatorService);

  user$: Observable<User | null> = authState(this.auth);

  laiksUser$: Observable<WithId<LaiksUser> | null> = this.user$.pipe(
    switchMap((user) => {
      if (!user) {
        return of(null);
      } else {
        const docRef = doc(
          this.firestore,
          USERS,
          user.uid,
        ) as DocumentReference<WithId<LaiksUser>>;
        return docData(docRef, { idField: 'id' }).pipe(throwIfNull(user.uid));
      }
    }),
    shareReplay(1),
  );

  login$: Observable<boolean> = this.user$.pipe(map((user) => !!user));

  admin$: Observable<boolean> = this.laiksUser$.pipe(
    switchMap((user) =>
      user ? this.permissionsService.isAdmin(user.id) : of(false),
    ),
  );

  npAllowed$: Observable<boolean> = this.laiksUser$.pipe(
    switchMap((user) =>
      user ? this.permissionsService.isNpBlocked(user.id) : of(true),
    ),
    map((blocked) => !blocked),
  );

  extraCostsFn$: Observable<(val: number) => number> = this.laiksUser$.pipe(
    throwIfNull(),
    map((user) => this.priceCalculatorService.getExtraCostsFn(user)),
  );

  vatFn$: Observable<(val: number) => number> = this.laiksUser$.pipe(
    throwIfNull(),
    map((user) => this.priceCalculatorService.getVatFn(user)),
  );

  async loginWithGmail(): Promise<LoginResponse> {
    const authProvider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(this.auth, authProvider);
    const laiksUser = await this.getLaiksUserSnapshot(user);

    if (laiksUser) {
      return { type: LoginResponseType.EXISTING, laiksUser };
    } else {
      const newLaiksUser = await this.createLaiksUser(user);
      return {
        type: LoginResponseType.CREATED,
        laiksUser: newLaiksUser,
      };
    }
  }

  async loginWithEmail(email: string, password: string): Promise<LaiksUser> {
    const { user } = await signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    const laiksUser = await this.getLaiksUserSnapshot(user);
    return this.deleteUserIfNotRegistered(laiksUser);
  }

  async createEmailAccount(
    email: string,
    password: string,
    name: string,
  ): Promise<WithId<LaiksUser>> {
    const userCredentials = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    await updateProfile(userCredentials.user, { displayName: name });

    const user = this.auth.currentUser;
    assertNotNull(user);

    return this.createLaiksUser({ ...user, displayName: name });
  }

  async deleteAccount(): Promise<void> {
    const user = this.auth.currentUser;

    if (user) {
      return user.delete();
    }
  }

  logout() {
    signOut(this.auth);
  }

  userPropertyObserver<T extends keyof LaiksUser>(
    key: T,
  ): Observable<LaiksUser[T]> {
    return this.laiksUser$.pipe(
      throwIfNull(),
      map((user) => user[key]),
    );
  }

  async updateLaiksUser(update: Partial<LaiksUser>) {
    const user = await firstValueFrom(this.user$);
    assertNotNull(user);
    const docRef = doc(this.firestore, USERS, user.uid);

    return updateDoc(docRef, update);
  }

  private async getLaiksUserSnapshot(
    user: User,
  ): Promise<LaiksUser | undefined> {
    const docRef = doc(
      this.firestore,
      USERS,
      user.uid,
    ) as DocumentReference<LaiksUser>;
    const snapshot = await getDoc(docRef);
    return snapshot.data();
  }

  private async createLaiksUser(user: User): Promise<WithId<LaiksUser>> {
    if (!user.email || !user.displayName) {
      throw new Error('Missing email or name');
    }

    const docRef = doc(
      this.firestore,
      USERS,
      user.uid,
    ) as DocumentReference<LaiksUser>;

    const laiksUser = defaultUser(user.email, user.displayName);
    await setDoc(docRef, laiksUser);
    return { ...laiksUser, id: user.uid };
  }

  async deleteLaiksUser(uid: string) {
    const docRef = doc(
      this.firestore,
      USERS,
      uid,
    ) as DocumentReference<LaiksUser>;
    return deleteDoc(docRef);
  }

  private async deleteUserIfNotRegistered(
    laiksUser: LaiksUser | undefined,
  ): Promise<LaiksUser | never> {
    if (laiksUser) {
      return laiksUser;
    } else {
      await deleteUser(this.auth.currentUser!);
      throw new Error('User not registered');
    }
  }
}
