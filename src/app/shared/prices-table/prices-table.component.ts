import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input, viewChildren
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { PowerApplianceWithHourlyCosts } from '@shared/appliances';
import { NpPriceWithOffset } from '@shared/np-data';
import { NumberSignPipe } from '@shared/utils';
import { AppliancesCostsComponent } from './appliances-costs/appliances-costs.component';
import { PriceColoredComponent } from './price-colored/price-colored.component';
import { PriceRowDirective } from './price-row.directive';
import { TimeIntervalComponent } from './time-interval/time-interval.component';

@Component({
  selector: 'laiks-prices-table',
  templateUrl: './prices-table.component.html',
  styleUrls: ['./prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    PriceRowDirective,
    MatListModule,
    DecimalPipe,
    DatePipe,
    NumberSignPipe,
    TimeIntervalComponent,
    AppliancesCostsComponent,
    PriceColoredComponent,
  ],
})
export class PricesTableComponent implements AfterViewInit {

  private priceRows = viewChildren(PriceRowDirective);

  private currentRow = computed(() => {
    if (!this.showDate()) {
      return null;
    }
    return this.priceRows().find(row => row.current()) || null;
  });

  displayedColumns = ['difference', 'time', 'appliances', 'price'];

  trackByFn: (index: number, item: NpPriceWithOffset) => number = (_, item) =>
    item.startTime.valueOf();

  private lastDate: Date | null = null;
  showDateHeaderFn: (index: number, rowData: NpPriceWithOffset) => boolean = (
    _,
    price
  ) => {
    const mustShow =
      this.showDate() && this.lastDate?.getDate() !== price.startTime.getDate();
    this.lastDate = price.startTime;
    return mustShow;
  };

  npPrices = input<NpPriceWithOffset[]>([]);


  appliances = input<PowerApplianceWithHourlyCosts[]>([]);

  average = input<number | null>(null);

  stDev = input<number | null>(null);

  showDate = input(false, { transform: booleanAttribute });

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.currentRow()?.scrollIn();
    }, 1000);
  }
}
