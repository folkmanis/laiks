import * as logger from 'firebase-functions/logger';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { updateAllNpData } from './update-all-np-data';

export const scheduledScraper = onSchedule(
  {
    region: 'europe-west1',
    schedule: 'every day 12:35',
  },
  async () => {
    await updateAllNpData(false);
    logger.info('Scheduled scrape complete');
  }
);
