import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  deleteDoc,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Permissions } from './permissions';

const PERMISSIONS = 'permissions';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private firestore = inject(Firestore);

  isNpUser(id: string): Observable<boolean> {
    const docRef = doc(
      this.firestore,
      PERMISSIONS,
      id
    ) as DocumentReference<Permissions>;
    return docData(docRef).pipe(
      map((data) => data == undefined || !data.npBlocked)
    );
  }

  isAdmin(id: string): Observable<boolean> {
    const docRef = doc(
      this.firestore,
      PERMISSIONS,
      id
    ) as DocumentReference<Permissions>;
    return docData(docRef).pipe(map((data) => data != undefined && data.admin));
  }

  deleteUser(id: string) {
    const docRef = doc(
      this.firestore,
      PERMISSIONS,
      id
    ) as DocumentReference<Permissions>;
    return from(deleteDoc(docRef));
  }

  setAdmin(id: string, value: boolean): Observable<void> {
    return this.setKey('admin', value, id);
  }

  setNpBlocked(id: string, value: boolean) {
    return this.setKey('npBlocked', value, id);
  }

  private setKey<K extends keyof Permissions>(
    key: K,
    value: Permissions[K],
    id: string
  ): Observable<void> {
    const resp = setDoc(
      doc(this.firestore, PERMISSIONS, id) as DocumentReference<Permissions>,
      { [key]: value },
      { merge: true }
    );
    return from(resp);
  }
}
