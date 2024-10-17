import { DEFAULT_MARKET_ZONES } from './default-market-zones';
import { parseNpJson } from './retrieve-np-data';
import { NpPrice } from './dto/np-price';
import { average, stDev } from './market-price-utilities';
import { TEST_AVERAGE, TEST_JSON_DATA, TEST_STDEV } from './dto/test-np-data';

const [TEST_ZONE_ID] = DEFAULT_MARKET_ZONES[0];

describe('Market price utils', () => {
  let data: NpPrice[];

  beforeEach(() => {
    data = parseNpJson(TEST_JSON_DATA)[TEST_ZONE_ID];
  });

  it('should calculate average', () => {
    expect(average(data)).toBeCloseTo(TEST_AVERAGE);
  });

  it('should calculate stDev', () => {
    expect(stDev(data)).toBeCloseTo(TEST_STDEV);
  });
});
