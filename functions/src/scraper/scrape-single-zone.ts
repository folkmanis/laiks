import { assertIsDefined } from '../utils/assertions';
import { getNpZone } from './np-zone-utilities';
import { retrieveNpData } from './retrieve-np-data';
import { updateNpZoneData } from './update-np-data';

export async function scrapeSingleZone(
  zoneId: string,
  forced: boolean = false
) {
  const zoneInfo = await getNpZone(zoneId);
  assertIsDefined(zoneInfo, 'zoneInfo');

  const npData = await retrieveNpData(zoneInfo.url);

  return updateNpZoneData(zoneInfo, npData, forced);
}
