import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'laiks-clock-display',
  templateUrl: './clock-display.component.html',
  styleUrls: ['./clock-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockDisplayComponent {

  @Input() time: Date = new Date();

}
