import { getFirestore } from 'firebase-admin/firestore';
import { MarketZone } from './dto/market-zone';

export async function getNpZones(): Promise<MarketZone[]> {
  const snapshot = await getFirestore()
    .collection('/zones')
    .where('enabled', '==', true)
    .get();
  return snapshot.docs.map((doc) => doc.data() as MarketZone);
}
