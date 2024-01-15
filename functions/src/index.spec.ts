// import { getFirestore } from 'firebase-admin/firestore';
// import { initializeApp } from 'firebase-admin/app';

import * as functionsTest from 'firebase-functions-test';
import { DEFAULT_MARKET_ZONES } from './scraper/default-market-zones';
import { MarketZone } from './scraper/dto/market-zone';
import { NpData } from './scraper/dto/np-data';
import { getTestNpData } from './scraper/dto/test-np-data';
import {
  ZONES_COLLECTION_NAME,
  createZonesSetup,
  getAllNpZones,
  getNpZoneByDbName,
  setNpZone,
} from './scraper/np-zone-utilities';
import {
  pricesCollection,
  pricesDocument,
} from './scraper/prices-collection-ref';
import { AVERAGE_DAYS, updateNpZoneData } from './scraper/update-np-data';

const test = functionsTest({
  projectId: process.env.GCLOUD_PROJECT,
});

import { moveLaiksDb } from './index';
// initializeApp();

const [TEST_ZONE_NAME, TEST_ZONE] = DEFAULT_MARKET_ZONES[0];

describe('np-data functions', () => {
  let testNpData: NpData;

  beforeAll(async () => {
    testNpData = getTestNpData();
    await createZonesSetup();
  });

  beforeEach(async () => {
    await updateNpZoneData(TEST_ZONE, testNpData, true);
  });

  afterEach(() => {
    test.cleanup();
  });

  it('np-data records should be written', async () => {
    const records = await pricesCollection(TEST_ZONE.dbName).get();
    expect(records.size).toBe(testNpData.getNpPrices().length);
  });

  it('prices document should have been written', async () => {
    const document = await pricesDocument(TEST_ZONE.dbName).get();
    const data = document.data()!;
    expect(data['average']).toBe(testNpData.average(AVERAGE_DAYS));
    expect(data['stDev']).toBe(testNpData.stDev(AVERAGE_DAYS));
    expect(data['averageDays']).toBe(AVERAGE_DAYS);
  });

  it('documnts should not be updated twice', async () => {
    await updateNpZoneData(TEST_ZONE, testNpData, true);
    const result = await updateNpZoneData(TEST_ZONE, testNpData, false);
    expect(result.storedRecords).toBe(0);
  });
});

describe('np-zone functions', () => {
  beforeEach(async () => {
    await createZonesSetup();
  });

  afterEach(() => {
    test.cleanup();
  });

  it('default zones should be created', async () => {
    const allZones = await getAllNpZones();
    const defaultZones = DEFAULT_MARKET_ZONES.map((zone) => zone[1]);
    expect(allZones).toContainEqual(defaultZones[0]);
  });

  it('should update zone', async () => {
    const update: Partial<MarketZone> = { description: 'test-description' };
    await setNpZone('LV', update);

    const lvZone = DEFAULT_MARKET_ZONES.find((zone) => (zone[0] = 'LV'))![1];

    const updated = await getNpZoneByDbName(lvZone.dbName);

    expect(updated).toEqual({ ...lvZone, ...update });
  });

  it('should rename prices db', async () => {
    const oldDbName = TEST_ZONE.dbName;
    const newDbName = TEST_ZONE.dbName + '_renamed';
    const testNpData = getTestNpData();
    await updateNpZoneData(TEST_ZONE, testNpData, true);
    const oldRecords = (await pricesCollection(oldDbName).get()).docs.map(
      (doc) => doc.data()
    );

    const beforeZone = test.firestore.makeDocumentSnapshot(
      { dbName: oldDbName },
      `${ZONES_COLLECTION_NAME}/${TEST_ZONE_NAME}`
    );
    const afterZone = test.firestore.makeDocumentSnapshot(
      { dbName: newDbName },
      `${ZONES_COLLECTION_NAME}/${TEST_ZONE_NAME}`
    );
    const change = test.makeChange(beforeZone, afterZone);

    const wrapped = test.wrap(moveLaiksDb);

    await wrapped(change);

    const newRecords = (await pricesCollection(newDbName).get()).docs.map(
      (doc) => doc.data()
    );

    expect(newRecords.length).toBe(oldRecords.length);
    expect((await pricesDocument(newDbName).get()).exists).toBeTruthy();
    expect((await pricesCollection(oldDbName).get()).size).toBe(0);
    expect((await pricesDocument(oldDbName).get()).exists).toBeFalsy();
  });
});
