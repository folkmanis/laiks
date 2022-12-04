import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NpPrice, NpPriceOffset } from '../np-data/lib/np-price.interface';
import { NpDataService } from '../np-data/lib/np-data.service';
import { map, Observable, combineLatest } from 'rxjs';
import { LaiksService } from 'src/app/shared/laiks.service';
import { differenceInHours } from 'date-fns';



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
    map(addDifference)
  );

  constructor(
    private npDataService: NpDataService,
    private laiksService: LaiksService,
  ) { }

}

function addDifference({ prices, dateNow }: { prices: NpPrice[], dateNow: Date; }): NpPriceOffset[] {
  return prices.map(price => ({ ...price, difference: differenceInHours(price.startTime, dateNow, { roundingMethod: 'ceil' }) }));
}