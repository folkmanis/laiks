import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  deleteDoc,
  doc,
  docData,
  docSnapshots,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { DEFAULT_PERMISSIONS, Permissions } from './permissions';

const PERMISSIONS = 'permissions';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private firestore = inject(Firestore);

  getPermissions(id: string): Observable<Permissions> {
    const docRef = doc(
      this.firestore,
      PERMISSIONS,
      id
    ) as DocumentReference<Permissions>;
    return docData(docRef).pipe(map((data) => data || DEFAULT_PERMISSIONS));
  }

  deleteUser(id: string) {
    const docRef = doc(
      this.firestore,
      PERMISSIONS,
      id
    ) as DocumentReference<Permissions>;
    return from(deleteDoc(docRef));
  }

  getUserPermissions(id: string): Observable<Permissions> {
    const documentRef = doc(
      this.firestore,
      PERMISSIONS,
      id
    ) as DocumentReference<Permissions>;
    return docSnapshots(documentRef).pipe(
      map((doc) => this.docOrDefaults(doc))
    );
  }

  setAdmin(id: string, value: boolean): Observable<void> {
    return this.setKey('admin', value, id);
  }

  setNpBlocked(id: string, value: boolean) {
    return this.setKey('npBlocked', value, id);
  }

  setUserPermissions(permissions: Permissions, id: string) {
    const documentRef = doc(
      this.firestore,
      PERMISSIONS,
      id
    ) as DocumentReference<Permissions>;
    setDoc(documentRef, permissions);
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

  private docOrDefaults(doc: DocumentSnapshot<Permissions>): Permissions {
    if (doc.exists()) {
      return {
        ...DEFAULT_PERMISSIONS,
        ...doc.data(),
      };
    } else {
      return { ...DEFAULT_PERMISSIONS };
    }
  }
}
