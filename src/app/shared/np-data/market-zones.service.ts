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
import { WithId, throwIfNull } from '@shared/utils';
import { Observable } from 'rxjs';
import { MarketZone } from './market-zone';

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
    return collectionData(
      this.collRef as CollectionReference<WithId<MarketZone>>,
      { idField: 'id' }
    ) as Observable<WithId<MarketZone>[]>;
  }

  getZoneFlow(id: string): Observable<MarketZone> {
    return docData(this.docRef(id)).pipe(throwIfNull(id));
  }

  updateZone(id: string, zoneUpdate: Partial<MarketZone>): Promise<void> {
    return updateDoc(this.docRef(id), zoneUpdate);
  }

  setZone(id: string, zone: MarketZone): Promise<void> {
    return setDoc(this.docRef(id), zone);
  }

  deleteZone(id: string): Promise<void> {
    return deleteDoc(this.docRef(id));
  }
}
