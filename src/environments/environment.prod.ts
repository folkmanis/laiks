import { firebaseProductionConfig } from '../firebase-config';

export const environment = {
  firebase: firebaseProductionConfig,
  production: true,
  emulators: false,
};
