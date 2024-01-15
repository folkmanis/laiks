import { Timestamp, WriteResult, getFirestore } from 'firebase-admin/firestore';
import { NpPrice } from './dto/np-price';
import { pricesCollection, pricesDocument } from './prices-collection-ref';

export async function writeNpData(
  zoneDbName: string,
  npPrices: NpPrice[],
  statistics: { average: number; stDev: number }
): Promise<WriteResult[]> {
  const batch = getFirestore().batch();

  const collectionRef = pricesCollection(zoneDbName);

  for (const price of npPrices) {
    const docRef = collectionRef.doc(price.startTime.toISOString());
    batch.set(docRef, price);
  }

  batch.set(
    pricesDocument(zoneDbName),
    {
      ...statistics,
      lastUpdate: Timestamp.now(),
    },
    { merge: true }
  );
  const result = await batch.commit();

  return result;
}
