import { Injectable } from '@angular/core';
import { collection, deleteDoc, collectionData, doc, DocumentData, DocumentSnapshot, Firestore, Timestamp, query, where, DocumentReference, getDoc, docData, CollectionReference, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, map, MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';
import { PowerAppliance } from './power-appliance.interface';
import { WithId } from 'src/app/shared/with-id';
import { throwIfNull } from 'src/app/shared/throw-if-null';

const APPLIANCES_COLL = 'powerAppliances';
@Injectable({
  providedIn: 'root'
})
export class PowerAppliancesService {

  constructor(
    private firestore: Firestore,
  ) { }

  getPowerAppliances(): Observable<WithId<PowerAppliance>[]> {
    const collRef = collection(this.firestore, APPLIANCES_COLL) as CollectionReference<PowerAppliance>;
    return collectionData(collRef, { idField: 'id' }) as Observable<WithId<PowerAppliance>[]>;
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
