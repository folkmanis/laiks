import { Injectable, inject } from '@angular/core';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
import { EMPTY, Observable, first, forkJoin, from, map, of } from 'rxjs';
import { ApplianceRecord, ApplianceType } from './laiks-user';
import { PowerAppliance } from './power-appliance.interface';
import { PowerAppliancesService } from './power-appliances.service';
import { throwIfNull } from './throw-if-null';
import { WithId } from './with-id';


export type ApplianceRecordWithData = ApplianceRecord & {
  data: PowerAppliance;
};

const APPLIANCES = 'appliances';
const USERS = 'users';

@Injectable({
  providedIn: 'root'
})
export class UserAppliancesService {

  private appliancesService = inject(PowerAppliancesService);
  private firestore = inject(Firestore);

  getActiveAppliances(
    userId: string,
    userAppliances: ApplianceRecord[]
  ): Observable<PowerAppliance[]> {
    return this.getActiveAppliancesWithData(userId, userAppliances).pipe(
      map(records => records.map(rec => rec.data))
    );
  }

  getActiveAppliancesWithData(
    userId: string,
    userAppliances: ApplianceRecord[]
  ): Observable<ApplianceRecordWithData[]> {
    const observables = this.getAppliancesObservers(userId, userAppliances);
    return observables.length === 0 ? of([]) : forkJoin(observables);
  }

  getUnusedAppliances(userId: string, existingAppliances: ApplianceRecord[]) {
    return forkJoin({
      system: this.appliancesOfType(userId, ApplianceType.SYSTEM, existingAppliances),
      user: this.appliancesOfType(userId, ApplianceType.USER, existingAppliances)
    });
  }

  userAppliances(userId: string): Observable<WithId<PowerAppliance>[]> {
    const collRef =
      collection(this.firestore, USERS, userId, APPLIANCES) as CollectionReference<WithId<PowerAppliance>>;
    return collectionData(collRef, { idField: 'id' });
  }

  userAppliancesByName(userId: string, name: string): Observable<PowerAppliance[]> {
    const collRef =
      collection(this.firestore, USERS, userId, APPLIANCES) as CollectionReference<WithId<PowerAppliance>>;
    return collectionData(query(collRef, where('name', '==', name)));
  }


  getUserAppliance(userId: string, id: string): Observable<PowerAppliance> {
    const docRef = doc(this.firestore, USERS, userId, APPLIANCES, id) as DocumentReference<PowerAppliance>;
    return from(getDoc(docRef)).pipe(
      map(doc => doc.data()),
      throwIfNull(id),
    );
  }

  updateUserAppliance(userId: string, id: string, appliance: PowerAppliance): Observable<void> {
    const docRef = doc(this.firestore, USERS, userId, APPLIANCES, id) as DocumentReference<PowerAppliance>;
    return from(updateDoc(docRef, appliance));
  }

  insertUserAppliance(userId: string, appliance: PowerAppliance): Observable<string> {
    const collRef = collection(this.firestore, USERS, userId, APPLIANCES) as CollectionReference<PowerAppliance>;
    return from(addDoc(collRef, appliance)).pipe(
      map(doc => doc.id),
    );
  }

  deleteUserAppliance(userId: string, id: string): Observable<void> {
    const docRef = doc(this.firestore, USERS, userId, APPLIANCES, id) as DocumentReference<PowerAppliance>;
    return from(deleteDoc(docRef));
  }


  private getAppliancesObservers(
    userId: string,
    records: ApplianceRecord[]
  ): Observable<ApplianceRecordWithData>[] {
    return records.map(rec => this.getApplianceRecordWithData(userId, rec));
  }

  private getApplianceRecordWithData(
    userId: string,
    record: ApplianceRecord
  ): Observable<ApplianceRecordWithData> {
    return this.getAppliance(userId, record).pipe(
      map(data => ({ ...record, data }))
    );
  }

  private getAppliance(userId: string, record: ApplianceRecord): Observable<PowerAppliance> {
    if (record.type === ApplianceType.SYSTEM) {
      return this.appliancesService.getAppliance(record.applianceId);
    }
    if (record.type === ApplianceType.USER) {
      return this.getUserAppliance(userId, record.applianceId);
    }
    return EMPTY;
  }

  private appliancesOfType(
    userId: string,
    type: ApplianceType,
    existingAppliances: ApplianceRecord[]
  ): Observable<WithId<PowerAppliance>[]> {

    const usedAppliancesIds: string[] = existingAppliances
      .filter(appliance => appliance.type === type)
      .map(appliance => appliance.applianceId);
    let appliances$: Observable<WithId<PowerAppliance>[]> = EMPTY;

    if (type === ApplianceType.SYSTEM) {
      appliances$ = this.appliancesService.getPowerAppliances({ enabledOnly: true });
    }
    if (type === ApplianceType.USER) {
      appliances$ = this.userAppliances(userId);
    }
    return appliances$.pipe(
      map(appliances => appliances.filter(ap => !usedAppliancesIds.includes(ap.id))),
      first(),
    );
  }


}
