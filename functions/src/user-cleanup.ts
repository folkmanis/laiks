import { getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';

export async function afterUserDeleted(
  uid: string,
  displayName: string | undefined
) {
  logger.log(`User ${uid}, ${displayName || ''} deleted`);
  await deleteLaiksUser(uid);
  await deleteAdmin(uid);
  await deleteNpBlocked(uid);
}

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
