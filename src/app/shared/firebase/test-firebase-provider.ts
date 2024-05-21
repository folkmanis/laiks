/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvironmentProviders } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from "@angular/fire/functions";
import { environment } from 'src/environments/environment';

export const testFirebaseProvider: EnvironmentProviders[] = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => {
    const auth = getAuth();
    console.log(auth.config);
    !(auth.config as any).emulator &&
      connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    return auth;
  }),
  provideFirestore(() => {
    const firestore = getFirestore();
    console.log(firestore.toJSON() as any);
    (firestore.toJSON() as any).settings.host !== '127.0.0.1:8080' &&
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    return firestore;
  }),
  provideFunctions(() => {
    const functions = getFunctions();
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    return functions;
  }),
];
