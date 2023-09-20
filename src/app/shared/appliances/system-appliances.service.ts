import { Injectable } from '@angular/core';
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
  constructor(private firestore: Firestore) {}

  getPowerAppliances(
    options: { enabledOnly?: boolean } = {}
  ): Observable<WithId<PresetPowerAppliance>[]> {
    const collRef = collection(
      this.firestore,
      APPLIANCES_COLL
    ) as CollectionReference<PresetPowerAppliance>;
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
  ): Observable<void> {
    const docRef = doc(
      this.firestore,
      APPLIANCES_COLL,
      id
    ) as DocumentReference<PresetPowerAppliance>;
    return from(updateDoc(docRef, update));
  }

  createAppliance(value: PresetPowerAppliance): Observable<string> {
    const collRef = collection(
      this.firestore,
      APPLIANCES_COLL
    ) as CollectionReference<PresetPowerAppliance>;
    return from(addDoc(collRef, value)).pipe(map((doc) => doc.id));
  }

  deleteAppliance(id: string): Observable<void> {
    const docRef = doc(
      this.firestore,
      APPLIANCES_COLL,
      id
    ) as DocumentReference<PresetPowerAppliance>;
    return from(deleteDoc(docRef));
  }
}
