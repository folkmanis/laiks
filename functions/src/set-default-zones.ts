import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { createZonesSetup } from './scraper/np-zone-utilities';

export const setDefaultZones = onRequest(
  {
    region: 'europe-west1',
  },
  async (_, response) => {
    try {
      const result = await createZonesSetup();
      response.json(result);
    } catch (error) {
      logger.error(error);
      response.status(501).json({ error: (error as Error).message });
    }
  }
);
