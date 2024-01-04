import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { getAuth } from 'firebase-admin/auth';

export const onLaiksUserDeleted = onDocumentDeleted(
  {
    document: 'users/{docId}',
    region: 'europe-west1',
  },
  (event) => {
    const id = event.data?.id;

    if (!id) {
      return;
    }

    const auth = getAuth();

    try {
      auth.deleteUser(id);
      logger.info(`Firebase user ${id} deleted`);
    } catch (error) {
      logger.error('Firebase user delete failed', error);
    }
  }
);
