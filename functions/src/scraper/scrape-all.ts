import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { updateAllNpData } from './update-all-np-data';

export const scrapeAll = onRequest(
  {
    region: 'europe-west1',
  },
  async (request, response) => {
    const forced = !!Number(request.query['forced']);
    logger.debug('forced', forced);
    try {
      const result = await updateAllNpData(forced);
      response.json(result);
    } catch (error) {
      response.status(400).json({ error: (error as Error).message });
    }
  }
);
