import { Injectable } from '@angular/core';
import { Firestore, DocumentReference, doc, collection, collectionData, CollectionReference, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LaiksUser } from 'src/app/shared/laiks-user';

import { WithId } from 'src/app/shared/with-id';

const USERS_COLL = 'users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

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

}
