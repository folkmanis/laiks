/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';
import { deleteInactiveUsersOnRequest } from './delete-inactive-users';
import { onLaiksUserDeleted } from './on-laiks-user-deleted';
import { scheduledUserMaintenance } from './scheduled-user-maintenance';
import { scheduledScraper } from './scraper/scheduled-scraper';
import { scrapeAll } from './scraper/scrape-all';
import { scrapeZone } from './scraper/scrape-zone';
import { setDefaultZones } from './set-default-zones';
import { userDeleteCleanup } from './user-cleanup';
import { onCopyLaiksDbRequest } from './copy-laiks-db';

initializeApp();

exports.userDeleteCleanup = userDeleteCleanup;

exports.onLaiksUserDeleted = onLaiksUserDeleted;

exports.scrapeZone = scrapeZone;

exports.scrapeAll = scrapeAll;

exports.deleteInactiveUsers = deleteInactiveUsersOnRequest;

exports.scheduledScraper = scheduledScraper;

exports.scheduledUserMaintenance = scheduledUserMaintenance;

exports.setDefaultZones = setDefaultZones;

exports.copyLaiksDb = onCopyLaiksDbRequest;
