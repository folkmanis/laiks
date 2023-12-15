import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

export const testFirebaseProvider = importProvidersFrom(
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => {
    const auth = getAuth();
    !(auth.config as any).emulator &&
      connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    return auth;
  }),
  provideFirestore(() => {
    const firestore = getFirestore();
    (firestore.toJSON() as any).settings.host !== '127.0.0.1:8080' &&
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    return firestore;
  })
);