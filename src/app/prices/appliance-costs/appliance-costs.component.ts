import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PowerAppliance } from '@shared/appliances';
import {
  NpDataService,
  NpPrice,
  NpPriceWithOffset,
  PriceCalculatorService,
} from '@shared/np-data';
import { PricesTableComponent } from '@shared/prices-table';
import {
  TimeObserverService,
  average,
  eurMwhToCentsKwh,
  stDev,
} from '@shared/utils';
import { addSeconds, hoursToSeconds } from 'date-fns';
import { sortBy } from 'lodash-es';
import { map, switchMap } from 'rxjs';
import { ApplianceNameComponent } from './appliance-name/appliance-name.component';

@Component({
  selector: 'laiks-appliance-costs',
  standalone: true,
  imports: [PricesTableComponent, ApplianceNameComponent],
  templateUrl: './appliance-costs.component.html',
  styleUrls: ['./appliance-costs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'vertical-container'
  },
})
export class ApplianceCostsComponent {
  private npDataService = inject(NpDataService);
  private calculator = inject(PriceCalculatorService);

  private minutes = toSignal(inject(TimeObserverService).minuteObserver(), {
    requireSync: true,
  });

  private npPrices$ = inject(TimeObserverService)
    .dayObserver()
    .pipe(
      switchMap(() => this.npDataService.getNpPricesWithVat(5)),
      map(eurMwhToCentsKwh)
    );

  private npPrices = toSignal(this.npPrices$);

  private costsForStatistics = computed(() =>
    this.computeAllCosts(this.npPrices(), this.appliance())
  );

  costs = computed(() =>
    this.computeHourlyCosts(this.npPrices(), this.appliance(), this.minutes())
  );

  appliance = input.required<PowerAppliance>();

  average = computed(() => average(this.costsForStatistics()));

  stDev = computed(() => stDev(this.costsForStatistics()));

  private computeHourlyCosts(
    npPrices: NpPrice[] | undefined,
    appliance: PowerAppliance,
    start: Date
  ): NpPriceWithOffset[] {
    if (!npPrices || npPrices.length == 0) {
      return [];
    }

    const cycleLength = this.calculator.cycleLength(appliance.cycles) / 1000;
    const costs = this.calculator.allOffsetCosts(npPrices, start, appliance);

    const startOffset = appliance.delay === 'start' ? 0 : -cycleLength;
    const endOffset = appliance.delay === 'start' ? cycleLength : 0;
    const prices = [...costs].map(([offset, value]) => ({
      value,
      difference: offset,
      dateNow: start,
      startTime: addSeconds(start, hoursToSeconds(offset) + startOffset),
      endTime: addSeconds(start, hoursToSeconds(offset) + endOffset),
    }));
    return sortBy(prices, (price) => price.value);
  }

  private computeAllCosts(
    npPrices: NpPrice[] | undefined,
    appliance: PowerAppliance
  ): number[] {
    if (!npPrices || npPrices.length == 0) {
      return [];
    }
    const costs = this.calculator.allOffsetCosts(
      npPrices,
      npPrices[0].startTime,
      appliance
    );
    return [...costs.values()];
  }
}
