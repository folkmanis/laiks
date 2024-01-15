import 'reflect-metadata';
import { NpData } from './np-data';
import { TEST_OBJ, getTestNpData } from './test-np-data';

describe('NpData', () => {
  let data: NpData;

  beforeEach(() => {
    data = getTestNpData();
  });

  it('should be defined', () => {
    expect(data).toBeDefined();
  });

  it('should parse string data', () => {
    expect(data.getNpPrices()).toEqual(TEST_OBJ);
  });

  it('should calculate average', () => {
    expect(data.average(2)).toBeCloseTo(111.65);
  });

  it('should calculate stDev', () => {
    expect(data.stDev(2)).toBeCloseTo(57.2);
  });
});
