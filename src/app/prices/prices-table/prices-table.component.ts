import { QueryList, ChangeDetectionStrategy, Component, Input, ViewChildren, AfterViewInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { NpPrice } from 'src/app/np-data/lib/np-price.interface';
import { PriceRowDirective } from './price-row.directive';

@Component({
  selector: 'laiks-prices-table',
  templateUrl: './prices-table.component.html',
  styleUrls: ['./prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricesTableComponent implements AfterViewInit {

  @ViewChildren(PriceRowDirective) private priceRows?: QueryList<PriceRowDirective>;

  displayedColumns = ['date', 'time', 'difference', 'price'];

  npPrices$ = new BehaviorSubject<NpPrice[]>([]);

  @Input()
  set npPrices(value: NpPrice[] | null) {
    if (Array.isArray(value)) {
      this.npPrices$.next(value);
    }
  }
  get npPrices() {
    return this.npPrices$.value;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const current = this.priceRows?.find(row => row.current);
      current && current.scrollIn();
    }, 1000);
  }

}
