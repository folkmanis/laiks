import {
  CollectionReference,
  DocumentReference,
  getFirestore,
} from 'firebase-admin/firestore';
import { NpPrice } from './dto/np-price';

export const PRICES_COLLECTION_NAME = 'prices';
export const LAIKS_DB_COLLECTION = 'laiks';

const collection = () => getFirestore().collection(LAIKS_DB_COLLECTION);

export const pricesDocument = (zoneDbName: string): DocumentReference =>
  collection().doc(zoneDbName);

export const pricesCollection = (zoneDbName: string) =>
  pricesDocument(zoneDbName).collection(
    PRICES_COLLECTION_NAME,
  ) as CollectionReference<NpPrice, NpPrice>;
