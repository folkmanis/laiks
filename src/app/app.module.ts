import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './lib/shared.module';
import { SelectorComponent } from './selector/selector.component';
import { NumberSignPipe } from './selector/number-sign.pipe';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { ClockOffsetComponent } from './clock-offset/clock-offset.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { NpDataComponent } from './np-data/np-data.component';
import { ApplianceConsumptionComponent } from './appliance-consumption/appliance-consumption.component';

import localeLv from '@angular/common/locales/lv';
registerLocaleData(localeLv);



@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    NumberSignPipe,
    ClockDisplayComponent,
    ClockOffsetComponent,
    NpDataComponent,
    ApplianceConsumptionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'lv' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
