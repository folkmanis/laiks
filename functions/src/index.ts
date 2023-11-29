/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';
import * as auth from 'firebase-functions/v1/auth';
import { onRequest } from 'firebase-functions/v2/https';
import { getNpZone } from './scraper/get-np-zone';
import { updateNpZoneData } from './scraper/update-np-data';
import { userCleanupHandler } from './user-cleanup';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { updateAllNpData } from './scraper/update-all-np-data';

initializeApp();

export const userDeleteCleanup = auth.user().onDelete(userCleanupHandler);

export const scrapeZone = onRequest(async (request, response) => {
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

    const result = await updateNpZoneData(zoneInfo);

    response.json(result);
  } catch (error) {
    logger.error(error);
    response.status(400).json({ error: (error as Error).message });
  }
});

export const scrapeAll = onRequest(async (_, response) => {
  try {
    const result = await updateAllNpData();
    response.json(result);
  } catch (error) {
    if (error instanceof Error) {
      response.status(500).json({ error: error.message });
    }
  }
});

export const scheduledScraper = onSchedule('every day 15:05', async () => {
  await updateAllNpData();
  logger.info('Scheduled scrape complete');
});
