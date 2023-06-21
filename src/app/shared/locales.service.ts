import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { WithId } from './with-id';
import { Locale } from './locale';

const LOCALES = 'locales';

@Injectable({
  providedIn: 'root'
})
export class LocalesService {

  private firestore = inject(Firestore);

  getLocales(): Observable<WithId<Locale>[]> {

    const collRef = collection(this.firestore, LOCALES) as CollectionReference<Locale>;

    return collectionData(collRef, { idField: 'id' }) as Observable<WithId<Locale>[]>;

  }

}
