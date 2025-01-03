import { inject, Injectable } from '@angular/core';
import {
  collectionData,
  docData,
  Firestore,
  Functions,
} from '@shared/firebase';
import { throwIfNull, WithId } from '@shared/utils';
import { formatISO, isValid, startOfDay, subDays } from 'date-fns';
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { LoginService } from '../users';
import { MarketZonesService } from './market-zones.service';
import { NpData, NpPrice, NpPriceCollectionData } from './np-price.interface';
import { ScrapeZoneResult } from './scrape-zone-result';

const DB_NAME = 'laiks';

@Injectable({
  providedIn: 'root',
})
export class NpDataService {
  private firestore = inject(Firestore);
  private loginService = inject(LoginService);
  private functions = inject(Functions);

  private marketZonesService = inject(MarketZonesService);

  private readonly extraCostsFn$ = this.loginService.extraCostsFn$;
  private readonly vatFn$ = this.loginService.vatFn$;

  private readonly dbDocName$ = this.loginService
    .userPropertyObserver('marketZoneId')
    .pipe(
      switchMap((id) => this.marketZonesService.getZoneFlow(id)),
      map((zone) => zone.dbName),
    );

  getNpPrices(days = 2): Observable<NpPrice[]> {
    return this.dbDocName$.pipe(
      map((docName) => collection(this.firestore, DB_NAME, docName, 'prices')),
      map((coll) =>
        query(
          coll,
          where('startTime', '>=', subDays(startOfDay(new Date()), days)),
        ),
      ),
      switchMap((q) => collectionData(q)),
      map((doc) => this.docToNpPrices(doc)),
    );
  }

  getNpPricesWithVat(days = 2): Observable<NpPrice[]> {
    return combineLatest({
      prices: this.getNpPrices(days),
      extraCostsFn: this.extraCostsFn$,
      vatFn: this.vatFn$,
    }).pipe(
      map(({ prices, extraCostsFn, vatFn }) =>
        prices.map(({ value, ...price }) => ({
          ...price,
          value: vatFn(extraCostsFn(value)),
        })),
      ),
    );
  }

  getNpDoc(): Observable<WithId<NpData>> {
    return this.dbDocName$.pipe(
      map(
        (docName) =>
          doc(this.firestore, DB_NAME, docName) as DocumentReference<
            WithId<NpData>
          >,
      ),
      switchMap((d) => docData(d, { idField: 'id' })),
      throwIfNull(),
    );
  }

  getNpDocWithVat(): Observable<WithId<NpData>> {
    return combineLatest({
      data: this.getNpDoc(),
      extraCostsFn: this.extraCostsFn$,
      vatFn: this.vatFn$,
    }).pipe(
      map(({ data: { stDev, average, ...data }, extraCostsFn, vatFn }) => ({
        ...data,
        stDev: vatFn(stDev),
        average: vatFn(extraCostsFn(average)),
      })),
    );
  }

  async scrapeAllZones(date?: Date | null): Promise<ScrapeZoneResult[]> {
    let dateString: string | undefined;
    if (date && isValid(date)) {
      dateString = formatISO(date, { representation: 'date' });
    }

    const scrape = httpsCallable<{ date?: string }, ScrapeZoneResult[]>(
      this.functions,
      'scrapeAll',
      {},
    );
    const result = await scrape({ date: dateString });
    return result.data;
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
  d: DocumentData,
): asserts d is NpPriceCollectionData[] {
  if (
    !Array.isArray(d) ||
    (d.length > 0 && !(d[0].startTime instanceof Timestamp))
  ) {
    throw new Error('Invalid data from server');
  }
}
