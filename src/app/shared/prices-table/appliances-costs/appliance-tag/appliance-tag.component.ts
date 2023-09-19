import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { NgIf, DecimalPipe } from '@angular/common';
import { colorDensity } from '@shared';

@Component({
  selector: 'laiks-appliance-tag',
  standalone: true,
  templateUrl: './appliance-tag.component.html',
  styleUrls: ['./appliance-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, DecimalPipe],
})
export class ApplianceTagComponent {
  @Input({ required: true }) name!: string;

  @Input({ required: true }) cost: number | null = null;

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
