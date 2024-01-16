import { Injectable, inject } from '@angular/core';
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
  writeBatch,
} from '@angular/fire/firestore';
import { httpsCallable, Functions } from '@angular/fire/functions';
import { throwIfNull, WithId } from '@shared/utils';
import { from, map, Observable } from 'rxjs';
import { LaiksUser } from '@shared/users';
import { DeleteInactiveUsersResult } from './delete-inactive-result';

const USERS_COLL = 'users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore = inject(Firestore);
  private functions = inject(Functions);

  private docRef = (id: string) =>
    doc(this.firestore, USERS_COLL, id) as DocumentReference<WithId<LaiksUser>>;

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
    return docData(this.docRef(id), { idField: 'id' }).pipe(throwIfNull(id));
  }

  updateUser(id: string, update: Partial<LaiksUser>): Observable<void> {
    return from(updateDoc(this.docRef(id), update));
  }

  deleteUser(id: string): Observable<void> {
    return from(deleteDoc(this.docRef(id)));
  }

  deleteUsers(ids: string[]): Observable<void> {
    const batch = writeBatch(this.firestore);
    ids.forEach((id) => batch.delete(this.docRef(id)));
    return from(batch.commit());
  }

  deleteInactiveUsers(
    maxInactiveDays?: number
  ): Observable<DeleteInactiveUsersResult> {
    const deleter = httpsCallable<
      { maxInactiveDays?: number },
      DeleteInactiveUsersResult
    >(this.functions, 'deleteInactiveUsers');
    return from(deleter({ maxInactiveDays })).pipe(
      map((response) => response.data)
    );
  }
}
