import { Injectable } from '@angular/core';
import { collection, collectionData, DocumentData, Firestore, query, Timestamp, where } from '@angular/fire/firestore';
import { startOfDay, subDays } from 'date-fns';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NpPrice, NpPriceCollectionData } from './np-price.interface';

const DB_NAME = environment.dbName;

@Injectable({
  providedIn: 'root'
})
export class NpDataService {


  constructor(
    private firestore: Firestore,
  ) { }

  getNpPrices(): Observable<NpPrice[]> {
    const npColl = collection(this.firestore, DB_NAME, 'np-data', 'prices');
    const latestPrices = query(npColl, where('startTime', '>=', subDays(startOfDay(new Date), 2)));
    return collectionData(latestPrices).pipe(
      map(doc => this.docToNpPrices(doc)),
    );
  }


  private docToNpPrices(doc: DocumentData): NpPrice[] {
    assertNpDocument(doc);
    return doc.map(d => ({
      startTime: d['startTime'].toDate(),
      endTime: d['endTime'].toDate(),
      value: d['value'],
    }));
  }

}

function assertNpDocument(d: DocumentData): asserts d is NpPriceCollectionData[] {
  if (!Array.isArray(d) || (d.length > 0 && !(d[0].startTime instanceof Timestamp))) {
    throw new Error('Invalid data from server');
  }
}