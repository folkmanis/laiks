import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { doc, docData, DocumentReference, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { LaiksUser } from './laiks-user';

export enum LoginResponseType {
  CREATED,
  EXISTING,
}

export interface LoginResponse {
  type: LoginResponseType,
  laiksUser: LaiksUser,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) { }

  getUser(): Observable<User | null> {
    return authState(this.auth);
  }

  login(): Observable<LoginResponse> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      switchMap(({ user }) => this.getLaiksUser(user).pipe(
        mergeMap(laiksUser => laiksUser ? of({ type: LoginResponseType.EXISTING, laiksUser }) : this.createLaiksUser(user).pipe(
          map(u => ({ type: LoginResponseType.CREATED, laiksUser: u }))
        )),

      )),
    );
  }

  logout() {
    signOut(this.auth);
  }

  isNpAllowed(): Observable<boolean> {
    return this.getUser().pipe(
      switchMap(usr => this.npAllowed(usr))
    );
  }

  private npAllowed(usr: User | null): Observable<boolean> {

    if (!usr || !usr.uid) {
      return of(false);
    }

    const docRef = doc(this.firestore, 'users', usr.uid);

    return docData(docRef).pipe(
      map(d => d && d['npAllowed'] === true)
    );

  }

  private getLaiksUser(user: User): Observable<LaiksUser | undefined> {

    const docRef = doc(this.firestore, 'users', user.uid) as DocumentReference<LaiksUser>;

    return from(getDoc(docRef)).pipe(
      map(snapshot => snapshot.data()),
    );
  }

  private createLaiksUser(user: User): Observable<LaiksUser> {

    if (!user.email || !user.displayName) {
      throw new Error('Missing email or name');
    }

    const docRef = doc(this.firestore, 'users', user.uid) as DocumentReference<LaiksUser>;

    const laiksUser: LaiksUser = {
      email: user.email,
      npAllowed: false,
      verified: false,
      name: user.displayName,
      isAdmin: false,
    };

    return from(setDoc(docRef, laiksUser)).pipe(
      map(() => laiksUser),
    );
  }

}
