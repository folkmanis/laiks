import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  collection,
} from 'firebase/firestore';
import { WithId } from '@shared/utils';
import { Observable, firstValueFrom } from 'rxjs';
import { Locale } from './locale';
import { Firestore } from "@shared/firebase";
import { collectionData } from "rxfire/firestore";

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
