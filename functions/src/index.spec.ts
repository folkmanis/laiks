import * as functionsTest from 'firebase-functions-test';
import { moveLaiksDb } from './index';
import { DEFAULT_MARKET_ZONES } from './scraper/default-market-zones';
import { TEST_OBJ } from './scraper/dto/test-np-data';
import {
  ZONES_COLLECTION_NAME,
  createZonesSetup,
} from './scraper/np-zone-utilities';
import {
  pricesCollection,
  pricesDocument,
} from './scraper/prices-collection-ref';
import { writeZonePrices } from './scraper/update-np-data';

const test = functionsTest({
  projectId: process.env.GCLOUD_PROJECT,
});

const [TEST_ZONE_ID, TEST_ZONE] = DEFAULT_MARKET_ZONES[0];

describe('np-zone functions', () => {
  beforeEach(async () => {
    await createZonesSetup();
  });

  afterEach(async () => {
    await dropDatabase();
    test.cleanup();
  });

  it('should rename prices db', async () => {
    const oldDbName = TEST_ZONE.dbName;
    const newDbName = TEST_ZONE.dbName + '_renamed';
    const testNpData = [...TEST_OBJ];
    await writeZonePrices(TEST_ZONE.dbName, testNpData);
    const oldRecords = (await pricesCollection(oldDbName).get()).docs.map(
      (doc) => doc.data(),
    );

    const beforeZone = test.firestore.makeDocumentSnapshot(
      { dbName: oldDbName },
      `${ZONES_COLLECTION_NAME}/${TEST_ZONE_ID}`,
    );
    const afterZone = test.firestore.makeDocumentSnapshot(
      { dbName: newDbName },
      `${ZONES_COLLECTION_NAME}/${TEST_ZONE_ID}`,
    );
    const change = test.makeChange(beforeZone, afterZone);

    const wrapped = test.wrap(moveLaiksDb);

    await wrapped({ data: change });

    const newRecords = (await pricesCollection(newDbName).get()).docs.map(
      (doc) => doc.data(),
    );

    expect(newRecords.length).toBe(oldRecords.length);
    expect((await pricesDocument(newDbName).get()).exists).toBeTruthy();
    expect((await pricesCollection(oldDbName).get()).size).toBe(0);
    expect((await pricesDocument(oldDbName).get()).exists).toBeFalsy();
  });
});

function dropDatabase() {
  const request = new Request(
    'http://localhost:8080/emulator/v1/projects/laiks-e2d86/databases/(default)/documents',
    { method: 'DELETE' },
  );
  return fetch(request);
}
