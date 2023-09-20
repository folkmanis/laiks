import { AsyncPipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { TimeObserverService, eurMwhToCentsKwh } from '@shared/utils';
import { addSeconds, hoursToSeconds } from 'date-fns';
import { sortBy } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs';
import { ApplianceNameComponent } from './appliance-name/appliance-name.component';
import { PricesTableComponent } from '@shared/prices-table';
import {
  NpDataService,
  NpPriceWithOffset,
  PriceCalculatorService,
} from '@shared/np-data';
import { PowerAppliance } from '@shared/appliances';

@Component({
  selector: 'laiks-appliance-costs',
  standalone: true,
  imports: [NgFor, AsyncPipe, PricesTableComponent, ApplianceNameComponent],
  templateUrl: './appliance-costs.component.html',
  styleUrls: ['./appliance-costs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplianceCostsComponent {
  private npDataService = inject(NpDataService);
  private calculator = inject(PriceCalculatorService);

  appliance$ = new BehaviorSubject<PowerAppliance | null>(null);
  @Input() set appliance(value: PowerAppliance | null | undefined) {
    this.appliance$.next(value || null);
  }

  private time$ = inject(TimeObserverService).minuteObserver();

  private npPrices$ = this.time$.pipe(
    map((time) => time.getDate),
    distinctUntilChanged(),
    switchMap(() => this.npDataService.getNpPricesWithVat(5)),
    map(eurMwhToCentsKwh)
  );

  private cycleLength$ = this.appliance$.pipe(
    map(
      (appliance) => this.calculator.cycleLength(appliance?.cycles || []) / 1000
    )
  );

  private statisticCosts$ = combineLatest([
    this.npPrices$,
    this.appliance$,
  ]).pipe(
    filter(([prices, appliance]) => !!prices[0] && !!appliance),
    map(([prices, appliance]) =>
      this.calculator.allOffsetCosts(prices, prices[0].startTime, appliance!)
    ),
    map((costs) => [...costs.values()])
  );

  costs$ = combineLatest([
    this.time$,
    this.npPrices$,
    this.appliance$,
    this.cycleLength$,
  ]).pipe(
    map(([time, npPrices, appliance, cycleLength]) =>
      appliance
        ? offsetCostsToNpPrices(
            this.calculator.allOffsetCosts(npPrices, time, appliance),
            time,
            appliance,
            cycleLength
          )
        : undefined
    ),
    map((costs) => sortBy(costs, (cost) => cost.value))
  );

  average$ = this.statisticCosts$.pipe(
    filter((costs) => costs.length > 0),
    map((costs) => costs!.reduce((acc, curr) => acc + curr, 0) / costs.length)
  );

  stDev$ = combineLatest([this.statisticCosts$, this.average$]).pipe(
    map(calculateStDev)
  );
}

function offsetCostsToNpPrices(
  costs: Map<number, number>,
  start: Date,
  appliance: PowerAppliance,
  cycleLength: number
): NpPriceWithOffset[] {
  const startOffset = appliance.delay === 'start' ? 0 : -cycleLength;
  const endOffset = appliance.delay === 'start' ? cycleLength : 0;
  const prices = [...costs].map(([offset, value]) => ({
    value,
    difference: offset,
    dateNow: start,
    startTime: addSeconds(start, hoursToSeconds(offset) + startOffset),
    endTime: addSeconds(start, hoursToSeconds(offset) + endOffset),
  }));
  return prices;
}

function calculateStDev([costs, average]: [
  number[] | undefined,
  number
]): number {
  if (costs == undefined || costs.length < 2) {
    return 0;
  }
  const sum = costs.reduce((acc, curr) => acc + Math.pow(curr - average, 2), 0);
  return Math.sqrt(sum / costs.length);
}
