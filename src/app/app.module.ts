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
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { NpDataModule } from './np-data/np-data.module';
import { AppRoutingModule } from './app-routing.module';

import localeLv from '@angular/common/locales/lv';
import { UserMenuComponent } from './user-menu/user-menu.component';
registerLocaleData(localeLv);

import { PricesComponent } from './prices/prices.component';



@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    ClockDisplayComponent,
    MainComponent,
    UserMenuComponent,
    PricesComponent,
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
  ],
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'lv' },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
