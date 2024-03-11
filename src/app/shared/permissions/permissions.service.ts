import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  deleteDoc,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

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

  setAdmin(id: string, value: boolean): Promise<void> {
    const docRef = this.adminDoc(id);
    return value ? setDoc(docRef, {}) : deleteDoc(docRef);
  }

  setNpBlocked(id: string, value: boolean): Promise<void> {
    const docRef = this.npBlockedDoc(id);
    return value ? setDoc(docRef, {}) : deleteDoc(this.npBlockedDoc(id));
  }
}
