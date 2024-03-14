import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PriceTimeComponent } from './price-time/price-time.component';

@Component({
  selector: 'laiks-time-interval',
  standalone: true,
  imports: [PriceTimeComponent],
  templateUrl: './time-interval.component.html',
  styleUrls: ['./time-interval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeIntervalComponent {
  from = input.required<Date>();
  to = input.required<Date>();
}
