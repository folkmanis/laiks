import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { differenceInHours, isDate } from 'date-fns';
import { switchMap } from 'rxjs';
import { LaiksService } from 'src/app/shared/laiks.service';
import { NpDataService } from 'src/app/shared/np-data.service';
import { NpPrice, NpPriceOffset } from 'src/app/shared/np-price.interface';
import { PriceCalculatorService } from 'src/app/shared/price-calculator.service';
import { UserAppliancesService } from 'src/app/shared/user-appliances.service';
import { UserService } from 'src/app/shared/user.service';
import { throwIfNull } from '../shared/throw-if-null';
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

  private appliancesService = inject(UserAppliancesService);
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

  private userService = inject(UserService);
  private appliances$ = this.userService.laiksUser().pipe(
    throwIfNull(),
    switchMap(user => this.appliancesService.getActiveAppliances(user.id, user.appliances || [])),
  );
  private powerAppliances = toSignal(
    this.appliances$,
    { initialValue: [] }
  );


  appliances = computed(() => {
    const prices = this.npPrices();
    return this.powerAppliances().map(appliance => ({
      ...appliance,
      bestOffset: this.calculator.bestOffset(
        this.calculator.allOffsetCosts(prices, getDateNow(prices), appliance)
      ),
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