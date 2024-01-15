import { onRequest } from 'firebase-functions/v2/https';
import { assertIsDefined, assertIsString } from '../utils/assertions';
import { getNpZone } from './np-zone-utilities';
import { updateNpZoneData } from './update-np-data';
import { retrieveNpData } from './retrieve-np-data';

export const scrapeSingleZone = onRequest(
  {
    region: 'europe-west1',
  },
  async (request, response) => {
    const forced = !!Number(request.query['forced']);
    const zoneId = request.query['zone'];

    assertIsString(zoneId, 'zone');

    const zoneInfo = await getNpZone(zoneId);

    assertIsDefined(zoneInfo, 'zoneInfo');

    const npData = await retrieveNpData(zoneInfo.url);

    const result = await updateNpZoneData(zoneInfo, npData, forced);

    response.json(result);
  }
);
