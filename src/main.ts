import { DEFAULT_CURRENCY_CODE, LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(
      provideAuth(() => getAuth())
    ),
    importProvidersFrom(
      provideFirestore(() => getFirestore())
    ),
    importProvidersFrom(MatSnackBarModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatDialogModule),
  ],
});