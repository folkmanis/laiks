import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, getDoc, query, updateDoc, where } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { throwIfNull } from 'src/app/shared/throw-if-null';
import { WithId } from 'src/app/shared/with-id';
import { PowerAppliance } from './power-appliance.interface';

const APPLIANCES_COLL = 'powerAppliances';
@Injectable({
  providedIn: 'root'
})
export class PowerAppliancesService {

  constructor(
    private firestore: Firestore,
  ) { }

  getPowerAppliances(options: { enabledOnly?: boolean; } = {}): Observable<WithId<PowerAppliance>[]> {
    const collRef = collection(this.firestore, APPLIANCES_COLL) as CollectionReference<PowerAppliance>;
    if (options.enabledOnly) {
      return collectionData(
        query(collRef, where('enabled', '==', true)),
        { idField: 'id' }
      ) as Observable<WithId<PowerAppliance>[]>;
    } else {
      return collectionData(collRef, { idField: 'id' }) as Observable<WithId<PowerAppliance>[]>;
    }
  }

  getAppliance(id: string): Observable<PowerAppliance> {
    const docRef = doc(this.firestore, APPLIANCES_COLL, id) as DocumentReference<PowerAppliance>;
    return from(getDoc(docRef)).pipe(
      map(doc => doc.data()),
      throwIfNull(id),
    );
  }

  getAppliancesByName(name: string): Observable<PowerAppliance[]> {
    const collRef = collection(this.firestore, APPLIANCES_COLL) as CollectionReference<PowerAppliance>;
    return collectionData(query(collRef, where('name', '==', name)));
  }

  updateAppliance(id: string, update: Partial<PowerAppliance>): Observable<void> {
    const docRef = doc(this.firestore, APPLIANCES_COLL, id) as DocumentReference<PowerAppliance>;
    return from(updateDoc(docRef, update));
  }

  createAppliance(value: PowerAppliance): Observable<string> {
    const collRef = collection(this.firestore, APPLIANCES_COLL) as CollectionReference<PowerAppliance>;
    return from(addDoc(collRef, value)).pipe(
      map(doc => doc.id),
    );
  }

  deleteAppliance(id: string): Observable<void> {
    const docRef = doc(this.firestore, APPLIANCES_COLL, id) as DocumentReference<PowerAppliance>;
    return from(deleteDoc(docRef));
  }
}
