import { QueryList, ChangeDetectionStrategy, Component, Input, ViewChildren, AfterViewInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { NpPriceOffset } from 'src/app/np-data/lib/np-price.interface';
import { PriceRowDirective } from './price-row.directive';
import { PowerAppliance, PowerApplianceWithBestOffset } from 'src/app/np-data/lib/power-appliance.interface';
import { NumberSignPipe } from '../../shared/number-sign.pipe';
import { ApplianceConsumptionComponent } from '../../np-data/appliance-consumption/appliance-consumption.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { HourDetailsDirective } from './hour-details.directive';
import { MatButtonModule } from '@angular/material/button';
import { AppliancePriceComponent } from './appliance-price/appliance-price.component';
import { NgIf, NgFor, DecimalPipe, DatePipe } from '@angular/common';
import { PriceTimeComponent } from './price-time/price-time.component';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'laiks-prices-table',
  templateUrl: './prices-table.component.html',
  styleUrls: ['./prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    PriceTimeComponent,
    NgIf,
    AppliancePriceComponent,
    MatButtonModule,
    HourDetailsDirective,
    MatIconModule,
    PriceRowDirective,
    MatListModule,
    NgFor,
    ApplianceConsumptionComponent,
    DecimalPipe,
    DatePipe,
    NumberSignPipe,
  ],
})
export class PricesTableComponent implements AfterViewInit {

  @ViewChildren(PriceRowDirective) private priceRows?: QueryList<PriceRowDirective>;

  displayedColumns = ['difference', 'date', 'time', 'price', 'appliance', 'expand'];

  npPrices$ = new BehaviorSubject<NpPriceOffset[]>([]);

  expanded: number | null = null;

  trackByFn: (index: number, item: NpPriceOffset) => any = (_, item) => item.startTime.valueOf();

  @Input()
  set npPrices(value: NpPriceOffset[] | null) {
    if (Array.isArray(value)) {
      this.npPrices$.next(value);
    }
  }
  get npPrices() {
    return this.npPrices$.value;
  }

  @Input()
  appliances: PowerApplianceWithBestOffset[] | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const current = this.priceRows?.find(row => row.current);
      console.log(current);
      current && current.scrollIn();
    }, 1000);
  }


}
