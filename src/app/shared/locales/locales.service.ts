import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { WithId } from '@shared/utils';
import { Observable, firstValueFrom } from 'rxjs';
import { Locale } from './locale';

const LOCALES = 'locales';

@Injectable({
  providedIn: 'root',
})
export class LocalesService {
  private firestore = inject(Firestore);

  getLocalesFlow(): Observable<WithId<Locale>[]> {
    const collRef = collection(this.firestore, LOCALES) as CollectionReference<WithId<Locale>>;
    return collectionData(collRef, { idField: 'id' });
  }

  getLocales(): Promise<WithId<Locale>[]> {
    return firstValueFrom(this.getLocalesFlow());
  }
}
