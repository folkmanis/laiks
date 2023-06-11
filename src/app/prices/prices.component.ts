import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { differenceInHours, isDate } from 'date-fns';
import { map } from 'rxjs';
import { NpDataService } from 'src/app/np-data/lib/np-data.service';
import { NpPrice, NpPriceOffset } from 'src/app/np-data/lib/np-price.interface';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';
import { PriceCalculatorService } from 'src/app/np-data/lib/price-calculator.service';
import { LaiksService } from 'src/app/shared/laiks.service';
import { PricesTableComponent } from './prices-table/prices-table.component';



@Component({
  selector: 'laiks-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PricesTableComponent]
})
export class PricesComponent {

  private npData = toSignal(
    inject(NpDataService).getNpPrices(),
    { initialValue: [] as NpPrice[] }
  );

  private dateNow = toSignal(
    inject(LaiksService).minuteObserver(),
    { requireSync: true }
  );

  npPrices = computed(() => addDifference(this.npData(), this.dateNow()));

  private calculator = inject(PriceCalculatorService);

  private powerAppliances = toSignal(
    inject(PowerAppliancesService).getPowerAppliances({ enabledOnly: true }),
    { initialValue: [] }
  );

  appliances = computed(() => {
    const prices = this.npPrices();
    return this.powerAppliances().map(appliance => ({
      ...appliance,
      bestOffset: this.calculator.bestOffset(prices, getDateNow(prices), appliance)
    }));
  });

}

function addDifference(prices: NpPrice[], dateNow: Date): NpPriceOffset[] {
  return prices.map(price => ({
    ...price,
    dateNow,
    difference: differenceInHours(price.startTime, dateNow, { roundingMethod: 'ceil' })
  }));
}

function getDateNow(prices: NpPriceOffset[]): Date {

  for (const price of prices) {
    if (isDate(price.dateNow)) {
      return price.dateNow;
    }
  }

  return new Date();
}