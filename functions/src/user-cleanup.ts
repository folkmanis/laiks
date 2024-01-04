import { UserRecord } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import * as auth from 'firebase-functions/v1/auth';

export const userDeleteCleanup = auth.user().onDelete((user: UserRecord) => {
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
  return getFirestore().doc(`/users/${uid}`).delete();
}

async function deleteAdmin(uid: string) {
  logger.log(`Deleting from admin db ${uid}`);
  return getFirestore().doc(`/admins/${uid}`).delete();
}

async function deleteNpBlocked(uid: string) {
  logger.log(`Deleting from npBlocked ${uid}`);
  return getFirestore().doc(`/npBlocked/${uid}`).delete();
}
