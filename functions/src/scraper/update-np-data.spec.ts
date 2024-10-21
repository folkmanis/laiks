import { initializeApp } from 'firebase-admin/app';
import { DEFAULT_MARKET_ZONES } from './default-market-zones';
import { NpPrice } from './dto/np-price';
import { TEST_AVERAGE, TEST_OBJ, TEST_STDEV } from './dto/test-np-data';
import { createZonesSetup } from './np-zone-utilities';
import { pricesCollection, pricesDocument } from './prices-collection-ref';
import {
  AVERAGE_DAYS,
  isNextDayDataInDb,
  writeZonePrices,
} from './update-np-data';

const [, TEST_ZONE] = DEFAULT_MARKET_ZONES[0];

describe('Np-data DB functions', () => {
  let testNpData: NpPrice[];

  beforeAll(() => {
    initializeApp();
  });

  beforeEach(async () => {
    testNpData = [...TEST_OBJ];
    await createZonesSetup();
    await writeZonePrices(TEST_ZONE.dbName, testNpData);
  });

  afterEach(async () => {
    await dropDatabase();
  });

  it('np-data records should be written', async () => {
    const records = await pricesCollection(TEST_ZONE.dbName).get();
    expect(records.size).toBe(testNpData.length);
  });

  it('prices document should have been written', async () => {
    const document = await pricesDocument(TEST_ZONE.dbName).get();
    const data = document.data()!;
    expect(data['average']).toBeCloseTo(TEST_AVERAGE, 5);
    expect(data['stDev']).toBeCloseTo(TEST_STDEV, 5);
    expect(data['averageDays']).toBe(AVERAGE_DAYS);
  });

  it('should not be today data in db', async () => {
    const result = await isNextDayDataInDb(DEFAULT_MARKET_ZONES);
    expect(result).toBe(true);
  });
});

function dropDatabase() {
  const request = new Request(
    'http://localhost:8080/emulator/v1/projects/laiks-e2d86/databases/(default)/documents',
    { method: 'DELETE' },
  );
  return fetch(request);
}
