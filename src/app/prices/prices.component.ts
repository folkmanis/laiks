import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NpPrice, NpPriceOffset } from 'src/app/np-data/lib/np-price.interface';
import { NpDataService } from 'src/app/np-data/lib/np-data.service';
import { map, Observable, combineLatest, mergeMap, toArray, from, shareReplay } from 'rxjs';
import { LaiksService } from 'src/app/shared/laiks.service';
import { differenceInHours, isDate } from 'date-fns';
import { PowerAppliance, PowerApplianceWithBestOffset } from 'src/app/np-data/lib/power-appliance.interface';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';
import { PriceCalculatorService } from 'src/app/np-data/lib/price-calculator.service';



@Component({
  selector: 'laiks-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricesComponent {

  npPrices$: Observable<NpPriceOffset[]> = combineLatest({
    prices: this.npDataService.npData$.pipe(
      map(data => data.prices),
    ),
    dateNow: this.laiksService.minuteObserver(),
  }
  ).pipe(
    map(addDifference),
    shareReplay(1),
  );

  appliances$: Observable<PowerApplianceWithBestOffset[]> = combineLatest({
    prices: this.npPrices$,
    appliances: this.appliancesService.getPowerAppliances()
      .pipe(
        map(appliances => appliances.filter(appl => appl.enabled)),
      ),
  }).pipe(
    mergeMap(({ prices, appliances }) => from(appliances).pipe(
      map(appliance => ({
        ...appliance,
        bestOffset: this.calculator.bestOffset(prices, getDateNow(prices), appliance)
      })),
      toArray(),
    ))
  );


  constructor(
    private npDataService: NpDataService,
    private laiksService: LaiksService,
    private appliancesService: PowerAppliancesService,
    private calculator: PriceCalculatorService,
  ) { }

}

function addDifference({ prices, dateNow }: { prices: NpPrice[], dateNow: Date; }): NpPriceOffset[] {
  return prices.map(price => (
    {
      ...price,
      dateNow,
      difference: differenceInHours(price.startTime, dateNow, { roundingMethod: 'ceil' })
    }
  ));
}

function getDateNow(prices: NpPriceOffset[]): Date {
  for (const price of prices) {
    if (isDate(price.dateNow)) {
      return price.dateNow;
    }
  }

  return new Date();
}