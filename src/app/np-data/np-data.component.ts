import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NpPrice } from 'src/app/shared/np-price.interface';
import { NpPricesComponent } from './np-prices/np-prices.component';


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
