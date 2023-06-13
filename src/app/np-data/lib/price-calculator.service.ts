import { Injectable } from '@angular/core';
import { addHours, isAfter, isBefore, subMilliseconds } from 'date-fns';
import { NpPrice } from './np-price.interface';
import { PowerAppliance, PowerConsumptionCycle } from './power-appliance.interface';

const msWtoMWh = (msWh: number): number => msWh / 1000 / 1000 / 60 / 60 / 1000;

@Injectable({
  providedIn: 'root'
})
export class PriceCalculatorService {

  priceTime(prices: NpPrice[], time: Date, appliance: PowerAppliance): number | null {
    const { delay, cycles } = appliance;

    if (delay === 'end') {
      time = subMilliseconds(time, this.cycleLength(cycles));
    }

    let totalCons = 0;
    let t = +time;

    for (const cycle of cycles) {

      const consumption = this.cycleConsumption(cycle, prices, t);

      if (consumption === null) {
        return null;
      }

      totalCons += consumption;
      t += cycle.length;

    }

    return msWtoMWh(totalCons); // EUR

  }

  bestOffset(npPrices: NpPrice[], startTime: Date, appliance: PowerAppliance): { offset: number, price: number; } | null {

    const { delay, minimumDelay } = appliance;

    const prices: { offset: number, price: number; }[] = [];

    if (delay === 'end') {
      startTime = addHours(startTime, minimumDelay);
    }

    const lastTime = npPrices.reduce((last, pr) => isAfter(pr.endTime, last) ? pr.endTime : last, new Date(0));

    let time = startTime;
    let offset = minimumDelay;

    while (isBefore(time, lastTime)) {

      const price = this.priceTime(npPrices, time, appliance);

      if (price !== null) {
        prices.push({ offset, price });
      }

      offset++;
      time = addHours(time, 1);
    }

    let bestOffset: { offset: number, price: number; } | null = null;

    for (const offset of prices) {
      if (bestOffset === null || offset.price < bestOffset.price) {
        bestOffset = offset;
      }
    }

    return bestOffset;

  }

  cycleConsumption(cycle: PowerConsumptionCycle, npPrices: NpPrice[], start: number): number | null {

    const end = start + cycle.length;

    let total = 0;
    let pos = start;

    while (pos !== end) {

      const price = npPrices.find(pr => pos >= +pr.startTime && pos < +pr.endTime)!;

      if (!price) {
        return null;
      }

      total += (Math.min(+price.endTime, end) - Math.max(+price.startTime, pos)) * cycle.consumption * price.value;

      pos = Math.min(+price.endTime, end);

    }

    return total;

  }

  cycleLength(cycles: PowerConsumptionCycle[]): number {
    return cycles.reduce((acc, curr) => acc + curr.length, 0);
  }

}
