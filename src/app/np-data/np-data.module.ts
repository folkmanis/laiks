import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NpPricesComponent } from './np-prices/np-prices.component';
import { NpDataComponent } from './np-data.component';
import { SharedModule } from '../shared/shared.module';
import { ApplianceConsumptionComponent } from './appliance-consumption/appliance-consumption.component';



@NgModule({
  declarations: [
    NpDataComponent,
    NpPricesComponent,
    ApplianceConsumptionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    NpDataComponent,
  ]
})
export class NpDataModule { }
