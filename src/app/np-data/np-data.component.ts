import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NpDataService } from './lib/np-data.service';
import { NpPricesComponent } from './np-prices/np-prices.component';
import { NpPrice } from './lib/np-price.interface';


@Component({
  selector: 'laiks-np-data',
  templateUrl: './np-data.component.html',
  styleUrls: ['./np-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NpPricesComponent]
})
export class NpDataComponent {


  @Input()
  time: Date = new Date();

  private _npPrices: NpPrice[] = [];
  @Input() set npPrices(value: NpPrice[] | null) {
    if (Array.isArray(value)) {
      this._npPrices = value;
    }
  }
  get npPrices(): NpPrice[] {
    return this._npPrices;
  }

  vat = 1.21;


}
