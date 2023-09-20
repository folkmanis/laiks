import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  QueryList,
  ViewChildren,
  signal,
  booleanAttribute,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { NumberSignPipe } from '@shared/utils';
import { PriceRowDirective } from './price-row.directive';
import { TimeIntervalComponent } from './time-interval/time-interval.component';
import { AppliancesCostsComponent } from './appliances-costs/appliances-costs.component';
import { PriceColoredComponent } from './price-colored/price-colored.component';
import { NpPriceWithOffset } from '@shared/np-data';
import { PowerApplianceWithHourlyCosts } from '@shared/appliances';

@Component({
  selector: 'laiks-prices-table',
  templateUrl: './prices-table.component.html',
  styleUrls: ['./prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    PriceRowDirective,
    MatListModule,
    NgFor,
    DecimalPipe,
    DatePipe,
    NumberSignPipe,
    TimeIntervalComponent,
    AppliancesCostsComponent,
    PriceColoredComponent,
  ],
})
export class PricesTableComponent implements AfterViewInit {
  @ViewChildren(PriceRowDirective)
  private priceRows?: QueryList<PriceRowDirective>;

  displayedColumns = ['difference', 'time', 'appliances', 'price'];

  trackByFn: (index: number, item: NpPriceWithOffset) => any = (_, item) =>
    item.startTime.valueOf();

  private lastDate: Date | null = null;
  showDateHeaderFn: (index: number, rowData: NpPriceWithOffset) => boolean = (
    _,
    price
  ) => {
    const mustShow =
      this.showDate && this.lastDate?.getDate() !== price.startTime.getDate();
    this.lastDate = price.startTime;
    return mustShow;
  };

  npPrices = signal<NpPriceWithOffset[]>([]);
  @Input('npPrices')
  set npPricesInput(value: NpPriceWithOffset[] | null | undefined) {
    if (Array.isArray(value)) {
      this.npPrices.set(value);
    }
  }

  @Input()
  appliances: PowerApplianceWithHourlyCosts[] | null = null;

  @Input() average: number | null = null;

  @Input() stDev: number | null = null;

  @Input({ transform: booleanAttribute }) showDate: boolean = false;

  ngAfterViewInit(): void {
    this.showDate &&
      setTimeout(() => {
        const current = this.priceRows?.find((row) => row.current);
        current && current.scrollIn();
      }, 1000);
  }
}
