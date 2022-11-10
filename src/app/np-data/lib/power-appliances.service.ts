import { Injectable } from '@angular/core';
import { collection, collectionData, doc, DocumentData, DocumentSnapshot, Firestore, onSnapshot, Timestamp, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PowerAppliance } from './power-appliance.interface';

@Injectable({
  providedIn: 'root'
})
export class PowerAppliancesService {

  constructor(
    private firestore: Firestore,
  ) { }

  getPowerAppliances() {
    const coll = collection(this.firestore, 'powerAppliances');
    return collectionData(coll) as Observable<PowerAppliance[]>;
  }
}
