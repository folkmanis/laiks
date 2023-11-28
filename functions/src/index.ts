/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as auth from "firebase-functions/v1/auth";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp();
const db = getFirestore();

export const userDeleteCleanup = auth.user().onDelete(async (user) => {
    const { uid, displayName } = user;
    logger.log(`User ${uid}, ${displayName} deleted`);
    return Promise.allSettled([
        deleteLaiksUser(uid),
        deleteAdmin(uid),
        deleteNpBlocked(uid),
    ]);
});

async function deleteLaiksUser(uid: string) {
    logger.info(`deleting LaiksUser ${uid}`);
    return db.doc(`/users/${uid}`).delete();
}

async function deleteAdmin(uid: string) {
    logger.log(`Deleting from admin db ${uid}`);
    return db.doc(`/admins/${uid}`).delete();
}

async function deleteNpBlocked(uid: string) {
    logger.log(`Deleting from npBlocked ${uid}`);
    return db.doc(`/npBlocked/${uid}`).delete();
}
