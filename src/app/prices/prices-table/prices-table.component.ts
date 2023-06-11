import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { NpPriceOffset } from 'src/app/np-data/lib/np-price.interface';
import { PowerApplianceWithBestOffset } from 'src/app/np-data/lib/power-appliance.interface';
import { ApplianceConsumptionComponent } from '../../np-data/appliance-consumption/appliance-consumption.component';
import { NumberSignPipe } from '../../shared/number-sign.pipe';
import { AppliancePriceComponent } from './appliance-price/appliance-price.component';
import { HourDetailsDirective } from './hour-details.directive';
import { PriceRowDirective } from './price-row.directive';
import { PriceTimeComponent } from './price-time/price-time.component';


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
      current && current.scrollIn();
    }, 1000);
  }


}
