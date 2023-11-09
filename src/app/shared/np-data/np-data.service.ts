import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  query,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { startOfDay, subDays } from 'date-fns';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { throwIfNull, WithId } from '@shared/utils';
import { LoginService } from '../users';
import { MarketZonesService } from './market-zones.service';
import { NpData, NpPrice, NpPriceCollectionData } from './np-price.interface';

const DB_NAME = 'laiks';

@Injectable({
  providedIn: 'root',
})
export class NpDataService {
  private firestore = inject(Firestore);
  private loginService = inject(LoginService);
  private marketZonesService = inject(MarketZonesService);

  private readonly vatFn$ = this.loginService.getVatFn();

  private readonly dbDocName$ = this.loginService
    .getUserProperty('marketZoneId')
    .pipe(
      switchMap((id) => this.marketZonesService.getZoneFlow(id)),
      map((zone) => zone.dbName)
    );

  getNpPrices(days = 2): Observable<NpPrice[]> {
    return this.dbDocName$.pipe(
      map((docName) => collection(this.firestore, DB_NAME, docName, 'prices')),
      map((coll) =>
        query(
          coll,
          where('startTime', '>=', subDays(startOfDay(new Date()), days))
        )
      ),
      switchMap((q) => collectionData(q)),
      map((doc) => this.docToNpPrices(doc))
    );
  }

  getNpPricesWithVat(days = 2): Observable<NpPrice[]> {
    return combineLatest({
      prices: this.getNpPrices(days),
      vatFn: this.vatFn$,
    }).pipe(
      map(({ prices, vatFn }) =>
        prices.map(({ value, ...price }) => ({
          ...price,
          value: vatFn(value),
        }))
      )
    );
  }

  getNpDoc(): Observable<WithId<NpData>> {
    return this.dbDocName$.pipe(
      map(
        (docName) =>
          doc(this.firestore, DB_NAME, docName) as DocumentReference<
            WithId<NpData>
          >
      ),
      switchMap((d) => docData(d, { idField: 'id' })),
      throwIfNull()
    );
  }

  getNpDocWithVat(): Observable<WithId<NpData>> {
    return combineLatest({ data: this.getNpDoc(), vatFn: this.vatFn$ }).pipe(
      map(({ data: { stDev, average, ...data }, vatFn }) => ({
        ...data,
        stDev: vatFn(stDev),
        average: vatFn(average),
      }))
    );
  }

  private docToNpPrices(doc: DocumentData): NpPrice[] {
    assertNpDocument(doc);
    return doc.map((d) => ({
      startTime: d['startTime'].toDate(),
      endTime: d['endTime'].toDate(),
      value: d['value'],
    }));
  }
}

function assertNpDocument(
  d: DocumentData
): asserts d is NpPriceCollectionData[] {
  if (
    !Array.isArray(d) ||
    (d.length > 0 && !(d[0].startTime instanceof Timestamp))
  ) {
    throw new Error('Invalid data from server');
  }
}
