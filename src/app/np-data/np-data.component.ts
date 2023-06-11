import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isDate } from 'date-fns';
import { map, Observable, share } from 'rxjs';
import { NpDataService } from './lib/np-data.service';
import { NpPrice } from './lib/np-price.interface';
import { PowerAppliance } from './lib/power-appliance.interface';
import { PowerAppliancesService } from './lib/power-appliances.service';
import { NpPricesComponent } from './np-prices/np-prices.component';
import { NgIf, AsyncPipe } from '@angular/common';


@Component({
  selector: 'laiks-np-data',
  templateUrl: './np-data.component.html',
  styleUrls: ['./np-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NpPricesComponent, AsyncPipe]
})
export class NpDataComponent {


  private _time = new Date(0);
  @Input() set time(value: Date) {
    if (isDate(value)) {
      this._time = value;
    }
  };
  get time(): Date {
    return this._time;
  }

  @Input() timeOffset: number = 0;

  npPrices$: Observable<NpPrice[]> = this.npDataService.npData$.pipe(
    map(data => data.prices),
    share(),
  );

  appliances$: Observable<PowerAppliance[]> = this.appliancesService.getPowerAppliances().pipe(
    map(appliances => appliances.filter(appl => appl.enabled)),
  );

  vat = 1.21;

  constructor(
    private npDataService: NpDataService,
    private appliancesService: PowerAppliancesService,
  ) { }




}
