import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
import {
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
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
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      BrowserAnimationsModule,
      MatSnackBarModule,
      MatDialogModule
    ),
  ],
});
