import * as logger from 'firebase-functions/logger';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { deleteInactiveUsers } from './delete-inactive-users';

// every even day at 01:00
export const scheduledUserMaintenance = onSchedule(
  {
    region: 'europe-west1',
    schedule: '0 1 2-31/2 * *',
  },
  async () => {
    await deleteInactiveUsers();
    logger.info('User cleanup complete');
  }
);
