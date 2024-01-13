import { getFirestore } from 'firebase-admin/firestore';
import { MarketZone } from './dto/market-zone';
import { DEFAULT_MARKET_ZONES } from './default-market-zones';

const ZONES_COLLECTION_NAME = 'zones';

export async function createZonesSetup() {
  const zonesCollection = getFirestore().collection(ZONES_COLLECTION_NAME);
  const batch = getFirestore().batch();

  for (const [docName, zone] of DEFAULT_MARKET_ZONES) {
    batch.set(zonesCollection.doc(docName), zone, { merge: true });
  }

  return batch.commit();
}

export async function getNpZones(): Promise<MarketZone[]> {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection(ZONES_COLLECTION_NAME)
    .where('enabled', '==', true)
    .get();
  return snapshot.docs.map((doc) => doc.data() as MarketZone);
}

export async function getAllNpZones(): Promise<MarketZone[]> {
  const firestore = getFirestore();
  const snapshot = await firestore.collection(ZONES_COLLECTION_NAME).get();
  return snapshot.docs.map((doc) => doc.data() as MarketZone);
}

export async function getNpZoneByDbName(
  dbName: string
): Promise<MarketZone | undefined> {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection(ZONES_COLLECTION_NAME)
    .where('dbName', '==', dbName)
    .get();
  return snapshot.docs[0]?.data() as MarketZone | undefined;
}

export async function getNpZone(
  zoneId: string
): Promise<MarketZone | undefined> {
  const firestore = getFirestore();
  const document = await firestore
    .collection(ZONES_COLLECTION_NAME)
    .doc(zoneId)
    .get();
  return document.data() as MarketZone | undefined;
}

export function setNpZone(zoneId: string, update: Partial<MarketZone>) {
  const firestore = getFirestore();
  const documenRef = firestore.collection(ZONES_COLLECTION_NAME).doc(zoneId);
  return documenRef.set(update, { merge: true });
}
