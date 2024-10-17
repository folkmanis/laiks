/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as auth from 'firebase-functions/v1/auth';
import {
  onDocumentDeleted,
  onDocumentUpdated,
} from 'firebase-functions/v2/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { deleteInactiveUsers } from './delete-inactive-users';
import { movePricesCollection } from './rename-laiks-db';
import { MarketZone } from './scraper/dto/market-zone';
import {
  ZONES_COLLECTION_NAME,
  createZonesSetup,
} from './scraper/np-zone-utilities';
import { afterUserDeleted } from './user-cleanup';
import {
  assertIsString,
  checkAdmin,
  checkAuthStatus,
} from './utils/assertions';
import {
  updateNextDayNpData,
  updateNpDataForDate,
} from './scraper/update-np-data';

initializeApp();

export const userDeleteCleanup = auth.user().onDelete((user) => {
  const { uid, displayName } = user;
  return afterUserDeleted(uid, displayName);
});

export const onLaiksUserDeleted = onDocumentDeleted(
  {
    document: 'users/{docId}',
    region: 'europe-west1',
  },
  (event) => {
    const id = event.data?.id;
    assertIsString(id, 'user id');
    getAuth().deleteUser(id);
  },
);

export const scrapeAll = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    checkAuthStatus(request.auth);
    await checkAdmin(request.auth.uid);

    const date = request.data['date'];
    if (date) {
      return updateNpDataForDate(date);
    } else {
      return updateNextDayNpData();
    }
  },
);

exports.deleteInactiveUsers = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    checkAuthStatus(request.auth);
    await checkAdmin(request.auth.uid);

    const maxInactiveDays = request.data['maxInactiveDays'];
    return deleteInactiveUsers(maxInactiveDays);
  },
);

exports.scheduledScraper = onSchedule(
  {
    region: 'europe-west1',
    schedule: 'every day 12:35',
  },
  async () => {
    await updateNextDayNpData();
  },
);

exports.scheduledUserMaintenance = onSchedule(
  {
    region: 'europe-west1',
    schedule: '0 1 2-31/2 * *',
  },
  () => {
    deleteInactiveUsers();
  },
);

exports.setDefaultZones = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    checkAuthStatus(request.auth);
    await checkAdmin(request.auth.uid);
    return createZonesSetup();
  },
);

export const moveLaiksDb = onDocumentUpdated(
  {
    document: `${ZONES_COLLECTION_NAME}/{zoneId}`,
    region: 'europe-west1',
    timeoutSeconds: 300,
  },
  async (event) => {
    const oldZone = event.data?.before.data() as MarketZone;
    const newZone = event.data?.after.data() as MarketZone;
    if (oldZone.dbName !== newZone.dbName) {
      await movePricesCollection(oldZone.dbName, newZone.dbName);
    }
  },
);
