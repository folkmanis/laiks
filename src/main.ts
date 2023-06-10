import { DEFAULT_CURRENCY_CODE, LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app-routes';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import localeLv from '@angular/common/locales/lv';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
registerLocaleData(localeLv);

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
bootstrapApplication(AppComponent, {
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'lv' },
    provideRouter(APP_ROUTES),
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