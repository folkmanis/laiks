import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { WithId } from '@shared';
import { MarketZone } from './market-zone';
import { Observable, from } from 'rxjs';

const ZONES = 'zones';

@Injectable({
  providedIn: 'root',
})
export class MarketZonesService {
  private collRef = collection(
    inject(Firestore),
    ZONES
  ) as CollectionReference<MarketZone>;
  private docRef = (id: string) => doc(this.collRef, id);

  getZonesFlow(): Observable<WithId<MarketZone>[]> {
    return collectionData(this.collRef, { idField: 'id' }) as Observable<
      WithId<MarketZone>[]
    >;
  }

  getZoneFlow(id: string): Observable<MarketZone> {
    return docData(this.docRef(id));
  }

  updateZone(id: string, zoneUpdate: Partial<MarketZone>): Observable<void> {
    return from(updateDoc(this.docRef(id), zoneUpdate));
  }

  setZone(id: string, zone: MarketZone): Observable<void> {
    return from(setDoc(this.docRef(id), zone));
  }

  deleteZone(id: string): Observable<void> {
    return from(deleteDoc(this.docRef(id)));
  }
}
