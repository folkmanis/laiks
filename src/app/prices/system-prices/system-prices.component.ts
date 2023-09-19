import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LoginService,
  NpDataService,
  NpPrice,
  NpPriceWithOffset,
  PowerApplianceWithHourlyCosts,
  PriceCalculatorService,
  PricesTableComponent,
  TimeObserverService,
  eurMwhToCentsKwh,
} from '@shared';
import { differenceInHours, isDate } from 'date-fns';
import { map } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'laiks-system-prices',
  standalone: true,
  imports: [PricesTableComponent],
  templateUrl: './system-prices.component.html',
  styleUrls: ['./system-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemPricesComponent {
  private calculator = inject(PriceCalculatorService);

  private readonly npDataService = inject(NpDataService);

  private npPrices = toSignal(
    this.npDataService.getNpPricesWithVat().pipe(map(eurMwhToCentsKwh)),
    {
      initialValue: [] as NpPrice[],
    }
  );

  private dateNow = toSignal(inject(TimeObserverService).minuteObserver(), {
    requireSync: true,
  });

  private powerAppliances = toSignal(
    inject(LoginService).getUserProperty('appliances'),
    { initialValue: [] }
  );

  private npData = toSignal(this.npDataService.getNpDocWithVat());

  npPricesWithOffset = computed(() =>
    addDifference(this.npPrices(), this.dateNow())
  );

  stDev: Signal<number> = computed(() => (this.npData()?.stDev ?? 0) / 10);

  average: Signal<number> = computed(() => (this.npData()?.average ?? 0) / 10);

  appliances: Signal<PowerApplianceWithHourlyCosts[]> = computed(() => {
    const prices = this.npPricesWithOffset();
    return this.powerAppliances().map((appliance) => {
      const costs = this.calculator.allOffsetCosts(
        prices,
        getDateNow(prices),
        appliance
      );
      const bestOffset = this.calculator.bestOffset(costs)?.offset;
      return {
        ...appliance,
        bestOffset,
        costs,
      };
    });
  });
}

function addDifference(prices: NpPrice[], dateNow: Date): NpPriceWithOffset[] {
  return prices.map((price) => ({
    ...price,
    dateNow,
    difference: differenceInHours(price.startTime, dateNow, {
      roundingMethod: 'ceil',
    }),
  }));
}

function getDateNow(prices: NpPriceWithOffset[]): Date {
  for (const price of prices) {
    if (isDate(price.dateNow)) {
      return price.dateNow;
    }
  }

  return new Date();
}
