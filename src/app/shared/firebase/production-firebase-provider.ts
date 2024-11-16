import { EnvironmentProviders } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { environment } from 'src/environments/environment';
import {
  provideFirebaseApp,
  provideAuth,
  provideFirestore,
  provideFunctions,
} from './firebase-providers';

export const provideFirebase: () => EnvironmentProviders[] = () => [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  provideFunctions(() => getFunctions(undefined, 'europe-west1')),
];
