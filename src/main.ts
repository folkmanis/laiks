import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
import {
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  provideFunctions,
  getFunctions,
  connectFunctionsEmulator,
} from '@angular/fire/functions';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { APP_ROUTES } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeLv);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'lv' },
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => {
        const auth = getAuth();
        environment.production ||
          connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
            disableWarnings: true,
          });
        return auth;
      }),
      provideFirestore(() => {
        const firestore = getFirestore();
        environment.production ||
          connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
        return firestore;
      }),
      provideFunctions(() => {
        const functions = getFunctions(undefined, 'europe-west1');
        environment.production ||
          connectFunctionsEmulator(functions, '127.0.0.1', 5001);
        return functions;
      }),
      BrowserAnimationsModule,
      MatSnackBarModule,
      MatDialogModule
    ),
  ],
});
