import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  host: {
    '[style.background-color]': 'background()',
    '[style.color]': 'textColor()',
  },
})
export class ApplianceTagComponent {
  name = input.required<string>();

  cost = input.required<number | null>();

  isBest = input(false);

  color = input.required<string | null>();

  background = computed(() => (this.isBest() ? this.color() : undefined));

  textColor = computed(() => {
    const background = this.background();
    if (background) {
      return colorDensity(background) > 0.5 ? 'black' : 'white';
    } else {
      return undefined;
    }
  });
}
