import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'laiks-clock-display',
  templateUrl: './clock-display.component.html',
  styleUrls: ['./clock-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DecimalPipe],
})
export class ClockDisplayComponent {
  time = input.required<Date>();

  hours = computed(() => this.time().getHours());

  minutes = computed(() => this.time().getMinutes());
}
