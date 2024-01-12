import { getNpZone } from './np-zone-utilities';
import { updateNpZoneData } from './update-np-data';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

export const scrapeZone = onRequest(
  {
    region: 'europe-west1',
  },
  async (request, response) => {
    const forced = !!Number(request.query['forced']);
    const zoneId = request.query['zone'];
    if (typeof zoneId !== 'string') {
      response.status(400).send('zone not provided');
      return;
    }

    try {
      const zoneInfo = await getNpZone(zoneId);

      if (zoneInfo == undefined) {
        response.status(400).json({ error: `Zone ${zoneId} not found` });
        return;
      }

      const result = await updateNpZoneData(zoneInfo, forced);

      response.json(result);
    } catch (error) {
      logger.error(error);
      response.status(400).json({ error: (error as Error).message });
    }
  }
);
