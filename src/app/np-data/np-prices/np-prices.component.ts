import { addHours, isDate, isWithinInterval, subHours } from 'date-fns';
import { Input, ChangeDetectionStrategy, Component, OnInit, signal, computed } from '@angular/core';
import { NpPrice } from '../lib/np-price.interface';
import { NgFor, DecimalPipe, DatePipe } from '@angular/common';


function inIntervalFn(time: Date): (price: NpPrice) => boolean {
  return ({ startTime, endTime }) => isWithinInterval(time, { start: subHours(startTime, 2), end: addHours(endTime, 1) });
}


@Component({
  selector: 'laiks-np-prices',
  templateUrl: './np-prices.component.html',
  styleUrls: ['./np-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, DecimalPipe, DatePipe]
})
export class NpPricesComponent {

  @Input() vat = 1;

  private _npPrices = signal<NpPrice[]>([]);
  @Input() set npPrices(value: NpPrice[]) {
    this._npPrices.set(value);
  }

  private _time = signal(new Date(0));
  @Input() set time(value: Date) {
    this._time.set(value);
  };

  pricesFiltered = computed(() => {
    const intervalPredicate = inIntervalFn(this._time());
    return this._npPrices().filter(intervalPredicate);
  });

  hours = computed(() => this._time().getHours());

}
