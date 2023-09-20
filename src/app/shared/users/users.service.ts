import { Injectable } from '@angular/core';
import {
  getDoc,
  Firestore,
  DocumentReference,
  doc,
  collection,
  collectionData,
  CollectionReference,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  docData,
} from '@angular/fire/firestore';
import { throwIfNull, WithId } from '@shared/utils';
import { from, map, Observable } from 'rxjs';
import { LaiksUser } from '@shared/users';

const USERS_COLL = 'users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private docRef = (id: string) =>
    doc(this.firestore, USERS_COLL, id) as DocumentReference<WithId<LaiksUser>>;

  constructor(private firestore: Firestore) {}

  getUsers(): Observable<WithId<LaiksUser>[]> {
    const collRef = collection(
      this.firestore,
      USERS_COLL
    ) as CollectionReference<WithId<LaiksUser>>;
    return collectionData(query(collRef, orderBy('email')), { idField: 'id' });
  }

  getUserById(id: string): Observable<LaiksUser> {
    return from(getDoc(this.docRef(id))).pipe(
      map((doc) => doc.data()),
      throwIfNull(id)
    );
  }

  userById(id: string): Observable<WithId<LaiksUser>> {
    return docData(this.docRef(id), { idField: 'id' });
  }

  updateUser(id: string, update: Partial<LaiksUser>): Observable<void> {
    return from(updateDoc(this.docRef(id), update));
  }

  deleteUser(id: string): Observable<void> {
    return from(deleteDoc(this.docRef(id)));
  }

  setVerified(id: string) {
    return this.updateUser(id, { verified: true });
  }
}
