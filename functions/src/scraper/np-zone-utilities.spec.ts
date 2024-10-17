import { initializeApp } from 'firebase-admin/app';
import { DEFAULT_MARKET_ZONES } from './default-market-zones';
import { MarketZone } from './dto/market-zone';
import {
  createZonesSetup,
  getAllNpZones,
  getNpZoneByDbName,
  setNpZone,
} from './np-zone-utilities';

describe('np-zone functions', () => {
  beforeAll(() => {
    initializeApp();
  });

  beforeEach(async () => {
    await createZonesSetup();
  });

  afterEach(async () => {
    await dropDatabase();
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
});

function dropDatabase() {
  const request = new Request(
    'http://localhost:8080/emulator/v1/projects/laiks-e2d86/databases/(default)/documents',
    { method: 'DELETE' },
  );
  return fetch(request);
}
