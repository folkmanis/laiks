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
import { UserComponent } from './user/user.component';

import localeLv from '@angular/common/locales/lv';
registerLocaleData(localeLv);



@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    ClockDisplayComponent,
    MainComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    NpDataModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'lv' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
