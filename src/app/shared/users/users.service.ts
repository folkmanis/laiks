import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { LaiksUser } from '@shared/users';
import { WithId, assertNotNull, throwIfNull } from '@shared/utils';
import { Observable } from 'rxjs';
import { DeleteInactiveUsersResult } from './delete-inactive-result';
import { Functions, Firestore } from '@shared/firebase';
import { docData, collectionData } from 'rxfire/firestore';

const USERS_COLL = 'users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore = inject(Firestore);
  private functions = inject(Functions);

  private docRef = (id: string) =>
    doc(this.firestore, USERS_COLL, id) as DocumentReference<WithId<LaiksUser>>;
  private collRef = collection(
    this.firestore,
    USERS_COLL,
  ) as CollectionReference<WithId<LaiksUser>>;

  usersFlow$: Observable<WithId<LaiksUser>[]> = collectionData(
    query(this.collRef, orderBy('email')),
    { idField: 'id' },
  );

  async getUserById(id: string): Promise<LaiksUser> {
    const snapshot = await getDoc(this.docRef(id));
    const user = snapshot.data();
    assertNotNull(user, id);
    return user;
  }

  userByIdFlow(id: string): Observable<WithId<LaiksUser>> {
    return docData(this.docRef(id), { idField: 'id' }).pipe(throwIfNull(id));
  }

  updateUser(id: string, update: Partial<LaiksUser>): Promise<void> {
    return updateDoc(this.docRef(id), update);
  }

  deleteUser(id: string): Promise<void> {
    return deleteDoc(this.docRef(id));
  }

  deleteUsers(ids: string[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    ids.forEach((id) => batch.delete(this.docRef(id)));
    return batch.commit();
  }

  async deleteInactiveUsers(
    maxInactiveDays?: number,
  ): Promise<DeleteInactiveUsersResult> {
    const deleter = httpsCallable<
      { maxInactiveDays?: number },
      DeleteInactiveUsersResult
    >(this.functions, 'deleteInactiveUsers');
    const response = await deleter({ maxInactiveDays });
    return response.data;
  }
}
