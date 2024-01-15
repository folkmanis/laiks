import {
  CollectionReference,
  DocumentReference,
  getFirestore,
} from 'firebase-admin/firestore';

export const PRICES_COLLECTION_NAME = 'prices';
export const LAIKS_DB_COLLECTION = 'laiks';

const collection = () => getFirestore().collection(LAIKS_DB_COLLECTION);

export const pricesDocument = (zoneDbName: string): DocumentReference =>
  collection().doc(zoneDbName);

export const pricesCollection = (zoneDbName: string): CollectionReference =>
  pricesDocument(zoneDbName).collection(PRICES_COLLECTION_NAME);
