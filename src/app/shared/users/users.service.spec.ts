import { WithId } from '@shared/utils';
import { LaiksUser, defaultUser } from './laiks-user';
import { dishWasher, washer } from '@shared/np-data/price-calculator.service.spec';

export const TEST_USER: WithId<LaiksUser> = {
    id: 'test_id',
    ...defaultUser('email@example.com', 'Test User'),
    appliances: [dishWasher, washer]
};
