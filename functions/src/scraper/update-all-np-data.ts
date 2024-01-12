import { getNpZones } from './np-zone-utilities';
import { updateNpZoneData } from './update-np-data';
import { PromisePool } from '@supercharge/promise-pool';

const MAX_CONCURRENT = 1;

export async function updateAllNpData(forced: boolean) {
  const zones = await getNpZones();

  return PromisePool.for(zones)
    .withConcurrency(MAX_CONCURRENT)
    .process(async (zone) => {
      return updateNpZoneData(zone, forced);
    });
}
