import { Injectable } from '@angular/core';
import { getDoc, Firestore, DocumentReference, doc, collection, collectionData, CollectionReference, query, orderBy, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { LaiksUser } from 'src/app/shared/laiks-user';

import { WithId } from 'src/app/shared/with-id';
import { throwIfNull } from 'src/app/shared/throw-if-null';

const USERS_COLL = 'users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private docRef = (id: string) => doc(this.firestore, USERS_COLL, id) as DocumentReference<LaiksUser>;

  constructor(
    private firestore: Firestore,
  ) { }

  getUsers(): Observable<WithId<LaiksUser>[]> {
    const collRef = collection(this.firestore, USERS_COLL) as CollectionReference<WithId<LaiksUser>>;
    return collectionData(
      query(collRef, orderBy('email')),
      { idField: 'id' }
    );
  }

  getUserById(id: string): Observable<LaiksUser> {
    return from(getDoc(this.docRef(id))).pipe(
      map(doc => doc.data()),
      throwIfNull(id),
    );
  }

  updateUser(id: string, update: Partial<LaiksUser>): Observable<void> {
    return from(updateDoc(this.docRef(id), update));
  }

  deleteUser(id: string): Observable<void> {
    return from(deleteDoc(this.docRef(id)));
  }

}
