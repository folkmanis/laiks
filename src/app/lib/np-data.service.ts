import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, query, collectionGroup, where, getDocs, getDocsFromCache, getDocFromCache, getDoc, Timestamp, onSnapshot, DocumentData, Unsubscribe, docData, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { from, Observable, map, tap, Subject, switchMap, of, shareReplay, share, asyncScheduler } from 'rxjs';
import { startOfDay, subDays } from 'date-fns';

const DB_NAME = environment.dbName;

export interface NpPrice {
  startTime: Date,
  endTime: Date,
  value: number,
}

interface NpData {
  prices: NpPrice[],
  lastUpdate: Date,
}

interface NpPriceCollectionData {
  startTime: Timestamp,
  endTime: Timestamp,
  value: number,
}

interface StoredNpData {
  prices: {
    startTime: string,
    endTime: string,
    value: number,
  }[],
  lastUpdate: string,
}


@Injectable({
  providedIn: 'root'
})
export class NpDataService {

  private storage = window.localStorage;

  private npCache: NpData | null = null;

  private lastUpdateTime$ = new Subject<DocumentSnapshot<DocumentData>>();

  npData$: Observable<NpData> = this.lastUpdateTime$.pipe(
    map(t => t.data()),
    tap(t => console.log('lastUpdateTime', t)),
    map(ts => ts?.['lastUpdate'] instanceof Timestamp ? ts['lastUpdate'].toDate() : new Date(0)),
    switchMap(t => t > this.getStoredPrices().lastUpdate ? this.getNpData(t) : of(this.getStoredPrices())),
    // map(d => d.prices),
  );


  constructor(
    private firestore: Firestore,
  ) { }

  connectUpdateTime() {
    return onSnapshot(doc(this.firestore, DB_NAME, 'np-data'), this.lastUpdateTime$);
  }


  private getNpData(timestamp: Date): Observable<NpData> {
    const npDoc = collection(this.firestore, DB_NAME, 'np-data', 'prices');
    return collectionData(npDoc).pipe(
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