import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './lib/shared.module';
import { SelectorComponent } from './selector/selector.component';
import { NumberSignPipe } from './selector/number-sign.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    NumberSignPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
