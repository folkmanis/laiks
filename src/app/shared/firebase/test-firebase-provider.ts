/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvironmentProviders } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { environment } from 'src/environments/environment';
import {
  provideAuth,
  provideFirebaseApp,
  provideFirestore,
  provideFunctions,
} from './firebase-providers';

export const provideTestFirebase: () => EnvironmentProviders[] = () => [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => {
    const auth = getAuth();
    console.log(auth.config);
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    // !(auth.config as any).emulator &&
    return auth;
  }),
  provideFirestore(() => {
    const firestore = getFirestore();
    console.log(firestore.toJSON() as any);
    if ((firestore.toJSON() as any).settings.host !== '127.0.0.1:8080') {
      console.log('connectFirestoreEmulator');
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    }
    return firestore;
  }),
  provideFunctions(() => {
    const functions = getFunctions(undefined, 'europe-west1');
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    return functions;
  }),
];
