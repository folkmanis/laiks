import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isDate } from 'date-fns';

@Component({
  selector: 'laiks-clock-display',
  templateUrl: './clock-display.component.html',
  styleUrls: ['./clock-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockDisplayComponent {

  @Input() time: Date | null = null;

  isDate(value: unknown): value is Date {
    return isDate(value);
  }

}
