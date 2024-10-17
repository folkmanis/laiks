import { readFileSync } from 'fs';
import { DEFAULT_MARKET_ZONES } from './default-market-zones';
import { TEST_OBJ } from './dto/test-np-data';
import { getScrapeUrl, parseNpJson } from './retrieve-np-data';

const TEST_DATA = readFileSync(
  './src/scraper/dto/test-np-data-v2.json',
  'utf-8',
);

const [TEST_ZONE_ID] = DEFAULT_MARKET_ZONES[0];

describe('Retrieve np data', () => {
  it('should create proper url', () => {
    expect(
      getScrapeUrl(new Date('2024-10-16T14:30:00.00Z'), ['LT', 'LV'], {
        currency: 'EUR',
      }),
    ).toBe(
      'https://dataportal-api.nordpoolgroup.com/api/DayAheadPrices?date=2024-10-16&market=DayAhead&deliveryArea=LT,LV&currency=EUR',
    );
  });

  it('should parse string data', () => {
    const data = parseNpJson(TEST_DATA);
    expect(data[TEST_ZONE_ID]).toEqual(TEST_OBJ);
  });
});
