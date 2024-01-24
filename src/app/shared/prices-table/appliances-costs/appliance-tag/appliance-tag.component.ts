import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  input,
} from '@angular/core';
import { colorDensity } from '@shared/utils';

@Component({
  selector: 'laiks-appliance-tag',
  standalone: true,
  templateUrl: './appliance-tag.component.html',
  styleUrls: ['./appliance-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
})
export class ApplianceTagComponent {
  name = input.required<string>();

  cost = input.required<number | null>();

  @Input() isBest: boolean = false;

  @Input({ required: true }) color: string | null = null;

  @HostBinding('style.background-color') get background() {
    return this.isBest ? this.color : undefined;
  }

  @HostBinding('style.color') get textColor() {
    const backg = this.background;
    if (typeof backg === 'string') {
      return colorDensity(backg) > 0.5 ? 'black' : 'white';
    } else {
      return undefined;
    }
  }
}
