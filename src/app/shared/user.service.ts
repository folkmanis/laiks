import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { doc, docData, DocumentReference, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { first, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { defaultUser, LaiksUser } from './laiks-user';
import { throwIfNull } from './throw-if-null';
import { WithId } from './with-id';

export enum LoginResponseType {
  CREATED,
  EXISTING,
}

export interface LoginResponse {
  type: LoginResponseType,
  laiksUser: LaiksUser,
}

const USERS = 'users';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  isLogin = (): Observable<boolean> => this.getUser()
    .pipe(map(user => !!user));

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) { }

  getUser(): Observable<User | null> {
    return authState(this.auth);
  }

  login(): Observable<LoginResponse> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      switchMap(({ user }) => this.getLaiksUserSnapshot(user).pipe(
        mergeMap(laiksUser => laiksUser ? of({ type: LoginResponseType.EXISTING, laiksUser }) : this.createLaiksUser(user).pipe(
          map(u => ({ type: LoginResponseType.CREATED, laiksUser: u }))
        )),

      )),
    );
  }

  logout() {
    signOut(this.auth);
  }

  laiksUser(): Observable<WithId<LaiksUser> | null> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        } else {
          const docRef = doc(this.firestore, USERS, user.uid) as DocumentReference<WithId<LaiksUser>>;
          return docData(docRef, { idField: 'id' });
        }
      }),
    );
  }

  updateLaiksUser(update: Partial<LaiksUser>) {
    return this.getUser().pipe(
      first(),
      throwIfNull(),
      map(user => doc(this.firestore, USERS, user.uid)),
      mergeMap(docRef => updateDoc(docRef, update))
    );
  }

  private getLaiksUserSnapshot(user: User): Observable<LaiksUser | undefined> {

    const docRef = doc(this.firestore, USERS, user.uid) as DocumentReference<LaiksUser>;

    return from(getDoc(docRef)).pipe(
      map(snapshot => snapshot.data()),
    );
  }

  private createLaiksUser(user: User): Observable<LaiksUser> {

    if (!user.email || !user.displayName) {
      throw new Error('Missing email or name');
    }

    const docRef = doc(this.firestore, USERS, user.uid) as DocumentReference<LaiksUser>;

    const laiksUser = defaultUser(user.email, user.displayName);

    return from(setDoc(docRef, laiksUser)).pipe(
      map(() => laiksUser),
    );
  }

}
