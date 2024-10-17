import PromisePool from '@supercharge/promise-pool';
import { addDays, startOfDay, subDays } from 'date-fns';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { MarketZone } from './dto/market-zone';
import { NpPrice } from './dto/np-price';
import { average, stDev } from './market-price-utilities';
import { getNpZones } from './np-zone-utilities';
import { pricesCollection, pricesDocument } from './prices-collection-ref';
import { retrieveNpData } from './retrieve-np-data';

const MAX_CONCURRENT = 1;
export interface NpDataUpdateOptions {
  averageDays: number;
}

export interface NpUpdateResult {
  zoneId: string;
  retrievedRecords: number;
  storedRecords: number;
}

export const AVERAGE_DAYS = 5;

export async function updateNextDayNpData() {
  const zones = await getNpZones();

  if (await isTodayDataInDb(zones)) {
    return [];
  } else {
    return updateNpDataForDate(addDays(startOfDay(new Date()), 1));
  }
}

export async function updateNpDataForDate(dateOrString: Date | string) {
  const date = new Date(dateOrString);

  const zones = await getNpZones();

  // scrape specified date
  const npData = await retrieveNpData(
    date,
    zones.map(([zoneId]) => zoneId),
  );

  // store data to db
  const updatedCount = await PromisePool.for(zones)
    .withConcurrency(MAX_CONCURRENT)
    .process(async ([zoneId, zone]) => {
      const count = await writeZonePrices(zone.dbName, npData[zoneId]);
      return count;
    });
  return updatedCount.results;
}

export async function writeZonePrices(
  zoneDbName: string,
  npPrices: NpPrice[],
): Promise<number> {
  const batch = getFirestore().batch();

  const collectionRef = pricesCollection(zoneDbName);

  for (const price of npPrices) {
    const docRef = collectionRef.doc(price.startTime.toISOString());
    batch.set(docRef, price);
  }

  const result = await batch.commit();

  logger.info(`Updated ${result.length} prices for ${zoneDbName}`);

  if (result.length > 0) {
    await updateAverages(zoneDbName);
  }

  return result.length;
}

export async function updateAverages(zoneDbName: string, date?: Date) {
  const fromDay = Timestamp.fromDate(
    subDays(startOfDay(date ?? new Date()), AVERAGE_DAYS),
  );
  const snapshot = await pricesCollection(zoneDbName)
    .where('startTime', '>=', fromDay)
    .get();
  const data = snapshot.docs.map((doc) => doc.data());

  return pricesDocument(zoneDbName).set(
    {
      lastUpdate: Timestamp.now(),
      average: average(data),
      stDev: stDev(data),
      averageDays: AVERAGE_DAYS,
    },
    { merge: true },
  );
}

export async function isTodayDataInDb(
  zones: [string, MarketZone][],
): Promise<boolean> {
  const lastDocUpdates = await PromisePool.for(zones)
    .withConcurrency(MAX_CONCURRENT)
    .process(async ([, zone]) => {
      const npData = await pricesDocument(zone.dbName).get();
      return (npData.updateTime || npData.createTime)?.toDate();
    });

  const today = startOfDay(new Date());

  logger.info(
    `Today ${today.toISOString()}, last update ${lastDocUpdates.results}`,
  );

  return lastDocUpdates.results.some((d) => d && d > today);
}
