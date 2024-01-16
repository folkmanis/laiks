import { PromisePool } from '@supercharge/promise-pool';
import { isBefore, subDays } from 'date-fns';
import { Auth, UserRecord, getAuth } from 'firebase-admin/auth';
import * as logger from 'firebase-functions/logger';

const MAX_USERS = 1000;
const MAX_INACTIVE_DAYS = 7;
const MAX_CONCURRENT_DELETES = 3;

export async function deleteInactiveUsers(days?: number) {
  const auth = getAuth();

  const inactiveDays = days ?? MAX_INACTIVE_DAYS;

  logger.log(`Looking for users inactive for ${inactiveDays} days`);

  const dateBefore = subDays(new Date(), inactiveDays);
  logger.log(
    `Looking for users last logged in before ${dateBefore.toDateString()}`
  );

  const inactiveUsers = await getInactiveAnonymousUsers(dateBefore, auth);
  logger.log(`Found ${inactiveUsers.length} inactive users`);

  const { results, errors } = await PromisePool.for(inactiveUsers)
    .withConcurrency(MAX_CONCURRENT_DELETES)
    .process((user) => auth.deleteUser(user.uid));

  logger.log(`Deleted ${results.length} users`);
  errors.forEach((err) =>
    logger.error(`Deletion of user ${err.item.uid} failed.`, err)
  );

  return {
    inactiveDays,
    inactiveUsers: inactiveUsers.map(({ uid }) => ({ uid })),
    results,
    errors,
  };
}

async function getInactiveAnonymousUsers(
  dateBefore: Date,
  auth: Auth,
  users: UserRecord[] = [],
  nextPageToken?: string
): Promise<UserRecord[]> {
  const result = await auth.listUsers(MAX_USERS, nextPageToken);

  const inactiveUsers = result.users.filter(
    (user) => user.providerData.length === 0 && lastLoginDays(dateBefore, user)
  );

  const allInactiveUsers = users.concat(inactiveUsers);

  if (result.pageToken) {
    return getInactiveAnonymousUsers(
      dateBefore,
      auth,
      allInactiveUsers,
      result.pageToken
    );
  } else {
    return allInactiveUsers;
  }
}

function lastLoginDays(dateBefore: Date, user: UserRecord): boolean {
  return isBefore(
    Date.parse(user.metadata.lastRefreshTime || user.metadata.lastSignInTime),
    dateBefore
  );
}
