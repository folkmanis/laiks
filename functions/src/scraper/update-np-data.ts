import { Timestamp } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { MarketZone } from './dto/market-zone';
import { NpData } from './dto/np-data';
import { NpPrice } from './dto/np-price';
import { writeNpData } from './write-np-data';
import { pricesCollection } from './prices-collection-ref';

export interface NpDataUpdateOptions {
  averageDays: number;
}

export interface NpUpdateResult {
  zoneId: string;
  retrievedRecords: number;
  storedRecords: number;
}

export const AVERAGE_DAYS = 5;

export async function updateNpZoneData(
  zoneInfo: MarketZone,
  npData: NpData,
  forced: boolean
): Promise<NpUpdateResult> {
  const prices = npData.getNpPrices();

  if (prices.length === 0) {
    logger.log('no data on server');
    return {
      zoneId: zoneInfo.description,
      retrievedRecords: 0,
      storedRecords: 0,
    };
  }

  if (forced) {
    logger.log('force storing all data');
    const statistics = {
      average: npData.average(AVERAGE_DAYS),
      stDev: npData.stDev(AVERAGE_DAYS),
      averageDays: AVERAGE_DAYS,
    };
    const result = await writeNpData(zoneInfo.dbName, prices, statistics);
    return {
      zoneId: zoneInfo.description,
      retrievedRecords: prices.length,
      storedRecords: result.length,
    };
  }

  const newData = await filterNewRecords(zoneInfo.dbName, npData.getNpPrices());

  if (newData.length === 0) {
    logger.log('no new data on server');
    return {
      zoneId: zoneInfo.description,
      retrievedRecords: prices.length,
      storedRecords: 0,
    };
  } else {
    logger.log('new data on server');
    const statistics = {
      average: npData.average(AVERAGE_DAYS),
      stDev: npData.stDev(AVERAGE_DAYS),
      averageDays: AVERAGE_DAYS,
    };
    const result = await writeNpData(zoneInfo.dbName, newData, statistics);
    return {
      zoneId: zoneInfo.description,
      retrievedRecords: prices.length,
      storedRecords: result.length,
    };
  }
}

async function filterNewRecords(
  zoneDbName: string,
  npPrices: NpPrice[]
): Promise<NpPrice[]> {
  let lastDate = new Date(0);

  const snapshot = await pricesCollection(zoneDbName)
    .orderBy('startTime', 'desc')
    .limit(1)
    .get();
  snapshot.forEach(
    (doc) => (lastDate = (doc.data().startTime as Timestamp).toDate())
  );

  return npPrices.filter(({ startTime }) => startTime > lastDate);
}
