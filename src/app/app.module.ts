import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { SharedModule } from './shared/shared.module';
import { SelectorComponent } from './selector/selector.component';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { MainComponent } from './main/main.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { NpDataModule } from './np-data/np-data.module';
import { AppRoutingModule } from './app-routing.module';

import localeLv from '@angular/common/locales/lv';
import { UserMenuComponent } from './user-menu/user-menu.component';
registerLocaleData(localeLv);

import { PricesComponent } from './prices/prices.component';
import { PricesTableComponent } from './prices/prices-table/prices-table.component';
import { PriceRowDirective } from './prices/prices-table/price-row.directive';
import { PriceTimeComponent } from './prices/prices-table/price-time/price-time.component';
import { AppliancePriceComponent } from './prices/prices-table/appliance-price/appliance-price.component';
import { HourDetailsDirective } from './prices/prices-table/hour-details.directive';

import { PricesComponent } from './prices/prices.component';
import { PricesTableComponent } from './prices/prices-table/prices-table.component';
import { PriceRowDirective } from './prices/prices-table/price-row.directive';
import { PriceTimeComponent } from './prices/prices-table/price-time/price-time.component';
import { AppliancePriceComponent } from './prices/prices-table/appliance-price/appliance-price.component';
import { HourDetailsDirective } from './prices/prices-table/hour-details.directive';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    ClockDisplayComponent,
    MainComponent,
    UserMenuComponent,
    PricesComponent,
    PricesTableComponent,
    PriceRowDirective,
    PriceTimeComponent,
    AppliancePriceComponent,
    HourDetailsDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    NpDataModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'lv' },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
