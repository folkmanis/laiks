import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'laiks-price-time',
  templateUrl: './price-time.component.html',
  styleUrls: ['./price-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceTimeComponent {

  @Input() time?: Date;

}
