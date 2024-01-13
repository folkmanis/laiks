// import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

import functionsTest = require('firebase-functions-test');
import {
  createZonesSetup,
  getAllNpZones,
  getNpZoneByDbName,
  setNpZone,
} from './scraper/np-zone-utilities';
import { DEFAULT_MARKET_ZONES } from './scraper/default-market-zones';
const test = functionsTest({
  projectId: process.env.GCLOUD_PROJECT,
});

// import firebaseFunctions = require('./index');
initializeApp();

describe('np-zone functions', () => {
  beforeEach(async () => {
    await createZonesSetup();
  });

  afterEach(() => {
    test.cleanup();
  });

  it('should create default zones', async () => {
    const allZones = await getAllNpZones();
    const defaultZones = DEFAULT_MARKET_ZONES.map((zone) => zone[1]);
    expect(allZones).toContainEqual(defaultZones[0]);
  });

  it('should update zone', async () => {
    const update = { dbName: 'updated-name' };
    await setNpZone('LV', update);

    const lvZone = DEFAULT_MARKET_ZONES.find((zone) => (zone[0] = 'LV'))![1];

    const updated = await getNpZoneByDbName(update.dbName);

    expect(updated).toEqual({ ...lvZone, ...update });
  });
});
