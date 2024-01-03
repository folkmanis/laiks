import { getFirestore } from 'firebase-admin/firestore';
import { DEFAULT_MARKET_ZONES } from './default-market-zones';

const ZONES_COLLECTION = 'zones';

export async function createZonesSetup() {
  const zonesCollection = getFirestore().collection(ZONES_COLLECTION);
  const batch = getFirestore().batch();

  for (const [docName, zone] of DEFAULT_MARKET_ZONES) {
    const docRef = zonesCollection.doc(docName);
    batch.set(docRef, zone, { merge: true });
  }

  return batch.commit();
}
