import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { collection, collectionData, doc, DocumentData, DocumentSnapshot, Firestore, onSnapshot, Timestamp, query, where, docData } from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';

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

  async login() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    signOut(this.auth);
  }

  isNpAllowed(): Observable<boolean> {
    return authState(this.auth).pipe(
      switchMap(usr => this.npAllowed(usr))
    );
  }

  private npAllowed(usr: User | null): Observable<boolean> {

    if (!usr || !usr.email) {
      return of(false);
    }

    const docRef = doc(this.firestore, 'users', usr.email);

    return docData(docRef).pipe(
      map(d => d && d['npAllowed'] === true)
    );

  }


}
