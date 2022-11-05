import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { addHours, isDate, isWithinInterval, subHours } from 'date-fns';
import { NpPrice } from '../lib/np-data.service';
import { washer } from '../lib/power-appliances';
import { PriceCalculatorService } from '../lib/price-calculator.service';


function inInterval(time: Date): (price: NpPrice) => boolean {
  return ({ startTime, endTime }: NpPrice) => isWithinInterval(time, { start: subHours(startTime, 2), end: addHours(endTime, 1) });
}

@Component({
  selector: 'laiks-np-data',
  templateUrl: './np-data.component.html',
  styleUrls: ['./np-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NpDataComponent implements OnInit {


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

  washerConsumption: number | null = null;
  bestWasher: { offset: number, price: number; } | null = null;

  pricesFiltered: NpPrice[] = [];


  constructor(
    private calculator: PriceCalculatorService,
  ) { }

  ngOnInit(): void {
  }

  private filterPrices() {

    this.pricesFiltered = this.npPrices.filter(inInterval(this.time));
    this.washerConsumption = this.calculator.priceTime(this.npPrices, this.time, washer);

    this.bestWasher = this.calculator.bestOffset(this.npPrices, new Date(), washer);

  }


}
