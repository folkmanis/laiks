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
import { deleteInactiveUsers } from './delete-inactive-users';
import { createZonesSetup } from './scraper/create-zones-setup';

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
    response.status(400).json({ error: (error as Error).message });
  }
});

export const deleteInactive = onRequest(async (_, response) => {
  try {
    const result = await deleteInactiveUsers();
    response.json(result);
  } catch (error) {
    logger.error(error);
    response.status(400).json({ error: (error as Error).message });
  }
});

export const scheduledScraper = onSchedule('every day 12:35', async () => {
  await updateAllNpData();
  logger.info('Scheduled scrape complete');
});

// every even day at 01:00
export const scheduledUserMaintenance = onSchedule(
  '0 1 2-31/2 * *',
  async () => {
    await deleteInactiveUsers();
    logger.info('User cleanup complete');
  }
);

export const setDefaultZones = onRequest(async (_, response) => {
  try {
    const result = await createZonesSetup();
    response.json(result);
  } catch (error) {
    logger.error(error);
    response.status(501).json({ error: (error as Error).message });
  }
});
