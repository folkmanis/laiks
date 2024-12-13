import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'laiks-price-time',
    templateUrl: './price-time.component.html',
    styleUrls: ['./price-time.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe]
})
export class PriceTimeComponent {
  time = input.required<Date>();
}
