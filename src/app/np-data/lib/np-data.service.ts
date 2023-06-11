import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, DocumentData, DocumentReference, Firestore, query, Timestamp, where } from '@angular/fire/firestore';
import { startOfDay, subDays } from 'date-fns';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NpData, NpPriceCollectionData, StoredNpData } from './np-price.interface';

const DB_NAME = environment.dbName;



@Injectable({
  providedIn: 'root'
})
export class NpDataService {

  private storage = window.localStorage;

  private npCache: NpData | null = null;

  private readonly lastUpdateRef = doc(this.firestore, DB_NAME, 'np-data') as DocumentReference<{ lastUpdate: Timestamp; }>;

  npData$: Observable<NpData> = docData(this.lastUpdateRef).pipe(
    map(ts => ts?.lastUpdate instanceof Timestamp ? ts.lastUpdate.toDate() : new Date(0)),
    switchMap(t => t > this.getStoredPrices().lastUpdate ? this.getNpData(t) : of(this.getStoredPrices())),
  );

  npPrices$ = this.npData$.pipe();

  constructor(
    private firestore: Firestore,
  ) { }


  private getNpData(timestamp: Date): Observable<NpData> {
    const npColl = collection(this.firestore, DB_NAME, 'np-data', 'prices');
    const latestPrices = query(npColl, where('startTime', '>=', subDays(startOfDay(new Date), 2)));
    return collectionData(latestPrices).pipe(
      map((d) => this.docToNpData(d, timestamp)),
      tap(p => this.storePrices(p)),
    );
  }

  private getStoredPrices(): NpData {

    if (!this.npCache) {
      const stored = this.storage.getItem('np-data');
      if (!stored) {
        this.npCache = {
          prices: [],
          lastUpdate: new Date(0),
        };

      } else {

        const pDoc: Record<string, string | number | object> = JSON.parse(stored);

        assertNpData(pDoc);

        this.npCache = {
          prices: pDoc.prices.map(p => ({
            value: +p.value,
            startTime: new Date(p.startTime),
            endTime: new Date(p.endTime)
          })),
          lastUpdate: new Date(pDoc.lastUpdate),
        };

      }

    }

    return this.npCache;

  }

  private storePrices(npData: NpData) {
    this.npCache = npData;
    const pStr: StoredNpData = {
      prices: npData.prices.map(p => ({
        startTime: p.startTime.toISOString(),
        endTime: p.endTime.toISOString(),
        value: p.value,
      })),
      lastUpdate: npData.lastUpdate.toISOString(),
    };
    this.storage.setItem('np-data', JSON.stringify(pStr));
  }

  private docToNpData(d: DocumentData, lastUpdate: Date): NpData {

    assertNpDocument(d);

    const prices = d.map(d => ({
      startTime: d['startTime'].toDate(),
      endTime: d['endTime'].toDate(),
      value: d['value'],
    }));
    return {
      prices,
      lastUpdate
    };
  }
}

function assertNpData(obj: any): asserts obj is StoredNpData {
  if (!Array.isArray(obj.prices)) {
    throw new Error('invalid data stored');
  }
}

function assertNpDocument(d: DocumentData): asserts d is NpPriceCollectionData[] {
  if (!Array.isArray(d) || (d.length > 0 && !(d[0].startTime instanceof Timestamp))) {
    throw new Error('Invalid data from server');
  }
}