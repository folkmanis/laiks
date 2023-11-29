import { getFirestore } from 'firebase-admin/firestore';
import { MarketZone } from './dto/market-zone';

export async function getNpZone(zoneId: string): Promise<MarketZone | undefined> {
    const document = await getFirestore().doc('/zones/' + zoneId).get();
    return document.data() as MarketZone | undefined;
}