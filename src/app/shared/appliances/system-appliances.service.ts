import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { throwIfNull, WithId } from '@shared/utils';
import { from, map, Observable } from 'rxjs';
import { PresetPowerAppliance } from './power-appliance.interface';

const APPLIANCES_COLL = 'powerAppliances';
@Injectable({
  providedIn: 'root',
})
export class SystemAppliancesService {
  private firestore = inject(Firestore);

  getPowerAppliances(
    options: { enabledOnly?: boolean; } = {}
  ): Observable<WithId<PresetPowerAppliance>[]> {
    const collRef = collection(
      this.firestore,
      APPLIANCES_COLL
    ) as CollectionReference<WithId<PresetPowerAppliance>>;
    if (options.enabledOnly) {
      return collectionData(query(collRef, where('enabled', '==', true)), {
        idField: 'id',
      }) as Observable<WithId<PresetPowerAppliance>[]>;
    } else {
      return collectionData(collRef, { idField: 'id' }) as Observable<
        WithId<PresetPowerAppliance>[]
      >;
    }
  }

  getAppliance(id: string): Observable<PresetPowerAppliance> {
    const docRef = doc(
      this.firestore,
      APPLIANCES_COLL,
      id
    ) as DocumentReference<PresetPowerAppliance>;
    return from(getDoc(docRef)).pipe(
      map((doc) => doc.data()),
      throwIfNull(id)
    );
  }

  getAppliancesByName(name: string): Observable<PresetPowerAppliance[]> {
    const collRef = collection(
      this.firestore,
      APPLIANCES_COLL
    ) as CollectionReference<PresetPowerAppliance>;
    return collectionData(query(collRef, where('name', '==', name)));
  }

  updateAppliance(
    id: string,
    update: Partial<PresetPowerAppliance>
  ): Promise<void> {
    const docRef = doc(
      this.firestore,
      APPLIANCES_COLL,
      id
    ) as DocumentReference<PresetPowerAppliance>;
    return updateDoc(docRef, update);
  }

  async createAppliance(value: PresetPowerAppliance): Promise<string> {
    const collRef = collection(
      this.firestore,
      APPLIANCES_COLL
    ) as CollectionReference<PresetPowerAppliance>;
    const result = await addDoc(collRef, value);
    return result.id;
  }

  deleteAppliance(id: string): Promise<void> {
    const docRef = doc(
      this.firestore,
      APPLIANCES_COLL,
      id
    ) as DocumentReference<PresetPowerAppliance>;
    return deleteDoc(docRef);
  }
}
