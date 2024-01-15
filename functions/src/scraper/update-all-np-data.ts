import { getNpZones } from './np-zone-utilities';
import { retrieveNpData } from './retrieve-np-data';
import { updateNpZoneData } from './update-np-data';
import { PromisePool } from '@supercharge/promise-pool';

const MAX_CONCURRENT = 1;

export async function updateAllNpData(forced: boolean) {
  const zones = await getNpZones();

  return PromisePool.for(zones)
    .withConcurrency(MAX_CONCURRENT)
    .process(async (zone) => {
      const npData = await retrieveNpData(zone.url);
      return updateNpZoneData(zone, npData, forced);
    });
}
