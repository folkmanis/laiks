import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { doc, docData, DocumentReference, Firestore, getDoc, setDoc, collectionData, updateDoc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { filter, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { LaiksUser } from './laiks-user';
import { PowerAppliance } from '../np-data/lib/power-appliance.interface';
import { collection, CollectionReference } from 'firebase/firestore';
import { throwIfNull } from './throw-if-null';

export enum LoginResponseType {
  CREATED,
  EXISTING,
}

export interface LoginResponse {
  type: LoginResponseType,
  laiksUser: LaiksUser,
}

const APPLIANCES = 'appliances';
const USERS = 'users';


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

  isNpAllowed(): Observable<boolean> {
    return this.getUser().pipe(
      switchMap(usr => this.npAllowed(usr))
    );
  }

  laiksUser(): Observable<LaiksUser | null> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        } else {
          const docRef = doc(this.firestore, USERS, user.uid) as DocumentReference<LaiksUser>;
          return docData(docRef);
        }
      }),
    );
  }

  userAppliances(): Observable<PowerAppliance[]> {
    return this.getUser().pipe(
      throwIfNull(),
      map(user => collection(this.firestore, USERS, user.uid, APPLIANCES) as CollectionReference<PowerAppliance>),
      switchMap(collRef => collectionData(collRef))
    );
  }

  getUserAppliance(id: string): Observable<PowerAppliance> {
    return this.getUser().pipe(
      throwIfNull(),
      map(user => doc(this.firestore, USERS, user.uid, APPLIANCES, id) as DocumentReference<PowerAppliance>),
      switchMap(docRef => docData(docRef)),
    );
  }

  updateUserAppliance(id: string, appliance: PowerAppliance): Observable<void> {
    return this.getUser().pipe(
      throwIfNull(),
      map(user => doc(this.firestore, USERS, user.uid, APPLIANCES, id) as DocumentReference<PowerAppliance>),
      mergeMap(docRef => updateDoc(docRef, appliance))
    );
  }

  insertUserAppliance(appliance: PowerAppliance): Observable<string> {
    return this.getUser().pipe(
      throwIfNull(),
      map(user => collection(this.firestore, USERS, user.uid, APPLIANCES) as CollectionReference<PowerAppliance>),
      mergeMap(collRef => addDoc(collRef, appliance)),
      map(doc => doc.id),
    );
  }

  deleteUserAppliance(id: string): Observable<void> {
    return this.getUser().pipe(
      throwIfNull(),
      map(user => doc(this.firestore, USERS, user.uid, APPLIANCES, id) as DocumentReference<PowerAppliance>),
      mergeMap(docRef => deleteDoc(docRef))
    );
  }

  private npAllowed(usr: User | null): Observable<boolean> {

    if (!usr || !usr.uid) {
      return of(false);
    }

    const docRef = doc(this.firestore, USERS, usr.uid);

    return docData(docRef).pipe(
      map(d => d && d['npAllowed'] === true)
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
