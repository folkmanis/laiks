import { firebaseEmulatorsConfig } from '../firebase-config';

export const environment = {
  firebase: firebaseEmulatorsConfig,
  production: false,
  emulators: true,
};
