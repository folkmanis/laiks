import { Injectable } from '@angular/core';
import { NpPrice } from './np-data.service';
import { areIntervalsOverlapping } from 'date-fns';

interface PowerConsumptionCycle {
  length: number, // milliseconds
  consumption: number, // watts
}

const msWtoMWh = 1000 * 1000 * 60 * 60 * 1000;

const washerConsumption: PowerConsumptionCycle[] = [
  {
    length: 5 * 60 * 1000,
    consumption: 100,
  },
  {
    length: 30 * 60 * 1000,
    consumption: 2000,
  },
  {
    length: 45 * 60 * 1000,
    consumption: 150,
  },
];

@Injectable({
  providedIn: 'root'
})
export class PriceCalculatorService {

  constructor() { }

  priceTime(prices: NpPrice[], time: Date): number {
    let totalCons = 0;
    let t = +time;
    for (const cycle of washerConsumption) {
      totalCons += this.intervalConsumption(cycle, prices, t);
      t += cycle.length;
    }
    return totalCons; // EUR
  }

  private intervalConsumption(cons: PowerConsumptionCycle, npPrices: NpPrice[], start: number,): number {

    const end = start + cons.length;
    const prices = npPrices.filter(p => areIntervalsOverlapping({ start: p.startTime, end: p.endTime }, { start, end }));
    let total = 0;
    for (const price of prices) {
      total += (Math.min(+price.endTime, end) - Math.max(+price.startTime, start)) * cons.consumption * price.value / msWtoMWh;
    }

    return total;
  }
}
