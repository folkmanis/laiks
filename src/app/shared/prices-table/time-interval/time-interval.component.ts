import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  @Input({ required: true }) from!: Date;
  @Input({ required: true }) to!: Date;
}
