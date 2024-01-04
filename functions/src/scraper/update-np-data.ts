import { plainToInstance } from 'class-transformer';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  WriteResult,
  getFirestore,
} from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { IncomingMessage } from 'node:http';
import { get } from 'node:https';
import { MarketZone } from './dto/market-zone';
import { NpData } from './dto/np-data';
import { NpPrice } from './dto/np-price';

export interface NpDataUpdateOptions {
  averageDays: number;
}

export interface NpUpdateResult {
  zoneId: string;
  retrievedRecords: number;
  storedRecords: number;
}

const PRICES_COLLECTION_NAME = 'prices';
const DB_COLLECTION = 'laiks';
const AVERAGE_DAYS = 5;

const collection = () => getFirestore().collection(DB_COLLECTION);

const pricesDocument = (zone: string): DocumentReference =>
  collection().doc(zone);

const pricesCollection = (zoneDbName: string): CollectionReference =>
  pricesDocument(zoneDbName).collection(PRICES_COLLECTION_NAME);

export async function updateNpZoneData(
  zoneInfo: MarketZone,
  forced: boolean
): Promise<NpUpdateResult> {
  logger.info(`Retrieving from ${zoneInfo.url}`);

  const npData = await getNpPrices(zoneInfo);

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

async function getNpPrices(zone: MarketZone): Promise<NpData> {
  const data = await getNpData(new URL(zone.url));

  const prices = plainToInstance(NpData, JSON.parse(data).data, {
    excludeExtraneousValues: true,
  });

  logger.log(`Parsed ${prices.getNpPrices().length} price records`);

  return prices;
}

async function getNpData(url: URL): Promise<string> {
  const req: IncomingMessage = await new Promise((resolve) =>
    get(url, resolve).end()
  );
  const data = await retrieveData(req);

  logger.log(`Retrieved from ${url} ${data.length} bytes of data`);

  return data;
}

function retrieveData(message: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let xml = '';
    message.on('data', (chunk) => (xml += chunk));
    message.on('end', () => resolve(xml));
  });
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

async function writeNpData(
  zoneDbName: string,
  npPrices: NpPrice[],
  statistics: { average: number; stDev: number }
): Promise<WriteResult[]> {
  const batch = getFirestore().batch();

  for (const price of npPrices) {
    const docRef = pricesCollection(zoneDbName).doc(
      price.startTime.toISOString()
    );
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
