import { Injectable, inject } from '@angular/core';
import { DocumentReference, DocumentSnapshot, Firestore, doc, docSnapshots, setDoc } from '@angular/fire/firestore';
import { Observable, filter, from, map } from 'rxjs';
import { DEFAULT_PERMISSIONS, Permissions } from 'src/app/shared/permissions';

const PERMISSIONS = 'permissions';


@Injectable({
  providedIn: 'root'
})
export class PermissionsAdminService {

  private firestore = inject(Firestore);


  getUserPermissions(id: string): Observable<Permissions> {
    const documentRef = doc(this.firestore, PERMISSIONS, id) as DocumentReference<Permissions>;
    return docSnapshots(documentRef).pipe(
      map(doc => this.docOrDefaults(doc)),
    );
  }

  setAdmin(id: string, value: boolean): Observable<void> {
    return this.setKey('admin', value, id);
  }

  setNpUser(id: string, value: boolean) {
    return this.setKey('npUser', value, id);
  }

  setUserPermissions(permissions: Permissions, id: string) {
    const documentRef = doc(this.firestore, PERMISSIONS, id) as DocumentReference<Permissions>;
    setDoc(documentRef, permissions);
  }

  private setKey<K extends keyof Permissions>(key: K, value: Permissions[K], id: string): Observable<void> {
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
