import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  deleteDoc,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

const ADMINS = 'admins';
const NP_BLOCKEDS = 'npBlocked';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private firestore = inject(Firestore);

  private readonly adminDoc = (id: string) => doc(this.firestore, ADMINS, id);
  private readonly npBlockedDoc = (id: string) =>
    doc(this.firestore, NP_BLOCKEDS, id);

  isNpBlocked(id: string): Observable<boolean> {
    return docData(this.npBlockedDoc(id)).pipe(map((data) => !!data));
  }

  isAdmin(id: string): Observable<boolean> {
    return docData(this.adminDoc(id)).pipe(map((data) => !!data));
  }

  deleteUser(id: string) {
    return from(
      Promise.all([
        deleteDoc(this.adminDoc(id)),
        deleteDoc(this.npBlockedDoc(id)),
      ])
    );
  }

  setAdmin(id: string, value: boolean): Observable<void> {
    if (value) {
      return from(setDoc(this.adminDoc(id), {}));
    } else {
      return from(deleteDoc(this.adminDoc(id)));
    }
  }

  setNpBlocked(id: string, value: boolean): Observable<void> {
    if (value) {
      return from(setDoc(this.npBlockedDoc(id), {}));
    } else {
      return from(deleteDoc(this.npBlockedDoc(id)));
    }
  }
}
