import { Injectable, inject } from '@angular/core';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Firestore } from '@shared/firebase';

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

  async isNpBlocked(id: string): Promise<boolean> {
    const data = await getDoc(this.npBlockedDoc(id));
    return data.exists();
  }

  async isAdmin(id: string): Promise<boolean> {
    const data = await getDoc(this.adminDoc(id));
    return data.exists();
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
