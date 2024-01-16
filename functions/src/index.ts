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
import { scrapeSingleZone } from './scraper/scrape-single-zone';
import { updateAllNpData } from './scraper/update-all-np-data';
import { afterUserDeleted } from './user-cleanup';
import {
  assertIsString,
  checkAdmin,
  checkAuthStatus,
} from './utils/assertions';

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
  }
);

export const scrapeZone = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    checkAuthStatus(request.auth);
    await checkAdmin(request.auth.uid);

    const zoneId = request.data['zone'];
    assertIsString(zoneId, 'zone');

    const forced = request.data['forced'];

    return scrapeSingleZone(zoneId, forced);
  }
);

export const scrapeAll = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    checkAuthStatus(request.auth);
    await checkAdmin(request.auth.uid);

    const forced = request.data['forced'];
    return updateAllNpData(forced);
  }
);

exports.deleteInactiveUsers = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    checkAuthStatus(request.auth);
    await checkAdmin(request.auth.uid);
    return deleteInactiveUsers();
  }
);

exports.scheduledScraper = onSchedule(
  {
    region: 'europe-west1',
    schedule: 'every day 12:35',
  },
  () => {
    updateAllNpData(false);
  }
);

exports.scheduledUserMaintenance = onSchedule(
  {
    region: 'europe-west1',
    schedule: '0 1 2-31/2 * *',
  },
  () => {
    deleteInactiveUsers();
  }
);

exports.setDefaultZones = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    checkAuthStatus(request.auth);
    await checkAdmin(request.auth.uid);
    return createZonesSetup();
  }
);

export const moveLaiksDb = onDocumentUpdated(
  `${ZONES_COLLECTION_NAME}/{zoneId}`,
  async (event) => {
    const oldZone = event.data?.before.data() as MarketZone;
    const newZone = event.data?.after.data() as MarketZone;
    if (oldZone.dbName !== newZone.dbName) {
      await movePricesCollection(oldZone.dbName, newZone.dbName);
    }
  }
);
