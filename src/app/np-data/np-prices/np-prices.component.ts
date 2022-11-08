import { addHours, isDate, isWithinInterval, subHours } from 'date-fns';
import { Input, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NpPrice } from '../lib/np-data.service';

function inInterval(time: Date): (price: NpPrice) => boolean {
  return ({ startTime, endTime }: NpPrice) => isWithinInterval(time, { start: subHours(startTime, 2), end: addHours(endTime, 1) });
}


@Component({
  selector: 'laiks-np-prices',
  templateUrl: './np-prices.component.html',
  styleUrls: ['./np-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NpPricesComponent implements OnInit {

  pricesFiltered: NpPrice[] = [];

  private _npPrices: NpPrice[] = [];
  @Input() set npPrices(value: NpPrice[]) {
    if (Array.isArray(value)) {
      this._npPrices = value;
      this.filterPrices();
    }
  }
  get npPrices() {
    return this._npPrices;
  }

  private _time = new Date(0);
  @Input() set time(value: Date) {
    if (isDate(value)) {
      this._time = value;
      this.filterPrices();
    }
  };
  get time() {
    return this._time;
  }



  constructor() { }

  ngOnInit(): void {
  }

  private filterPrices() {

    this.pricesFiltered = this.npPrices.filter(inInterval(this.time));

  }


}
