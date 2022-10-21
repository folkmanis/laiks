import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './lib/shared.module';
import { SelectorComponent } from './selector/selector.component';
import { NumberSignPipe } from './selector/number-sign.pipe';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { ClockOffsetComponent } from './clock-offset/clock-offset.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    NumberSignPipe,
    ClockDisplayComponent,
    ClockOffsetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
