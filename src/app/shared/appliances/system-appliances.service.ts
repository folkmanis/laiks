import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@shared/firebase';
import { dataOrThrow, WithId } from '@shared/utils';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  Query,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { PresetPowerAppliance } from './power-appliance.interface';

const APPLIANCES_COLL = 'powerAppliances';
@Injectable({
  providedIn: 'root',
})
export class SystemAppliancesService {
  private firestore = inject(Firestore);

  getPowerAppliances<
    T extends DocumentData = PresetPowerAppliance,
    D extends WithId<T> = WithId<T>,
  >({
    enabledOnly,
    name,
  }: { enabledOnly?: boolean; name?: string } = {}): Observable<D[]> {
    let collRef = collection(this.firestore, APPLIANCES_COLL) as
      | CollectionReference<T>
      | Query<T>;
    if (enabledOnly) {
      collRef = query(collRef, where('enabled', '==', true));
    }
    if (name) {
      collRef = query(collRef, where('name', '==', name));
    }
    return collectionData(collRef, { idField: 'id' }) as Observable<D[]>;
  }

  async getAppliance(id: string): Promise<PresetPowerAppliance> {
    const docRef = doc(
      this.firestore,
      APPLIANCES_COLL,
      id,
    ) as DocumentReference<PresetPowerAppliance>;
    const snapshot = await getDoc(docRef);
    return dataOrThrow(snapshot);
  }

  async updateAppliance(
    id: string,
    update: Partial<PresetPowerAppliance>,
  ): Promise<void> {
    const docRef = doc(
      this.firestore,
      APPLIANCES_COLL,
      id,
    ) as DocumentReference<PresetPowerAppliance>;
    return updateDoc(docRef, update);
  }

  async createAppliance(value: PresetPowerAppliance): Promise<string> {
    const collRef = collection(
      this.firestore,
      APPLIANCES_COLL,
    ) as CollectionReference<PresetPowerAppliance>;
    const result = await addDoc(collRef, value);
    return result.id;
  }

  async deleteAppliance(id: string): Promise<void> {
    const docRef = doc(
      this.firestore,
      APPLIANCES_COLL,
      id,
    ) as DocumentReference<PresetPowerAppliance>;
    return deleteDoc(docRef);
  }
}
