import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
import {
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  enableProdMode,
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { productionFirebaseProvider } from '@shared/firebase/production-firebase-provider';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { APP_ROUTES } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeLv);

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'lv' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    ...(environment.emulators ? testFirebaseProvider : productionFirebaseProvider),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatSnackBarModule,
      MatDialogModule
    ),
  ],
});

