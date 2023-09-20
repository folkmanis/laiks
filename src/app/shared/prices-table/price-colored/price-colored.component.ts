import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { colorDensity } from '@shared/utils';

const BACKGROUND = '#424242';

@Component({
  selector: 'laiks-price-colored',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './price-colored.component.html',
  styleUrls: ['./price-colored.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceColoredComponent {
  @Input({ required: true }) value: number = 0;
  @Input() average: number | null = null;

  @Input() stDev: number | null = null;

  get score() {
    if (
      this.stDev === 0 ||
      this.average == null ||
      this.stDev == null ||
      this.value == null
    ) {
      return 0;
    }
    const score = (this.average - this.value) / this.stDev; // .coerceIn(-1.0, 1.0)
    if (score < -1) return -1;
    if (score > 1) return 1;
    return score;
  }

  @HostBinding('style.color') get color() {
    return scoreColor(this.score, BACKGROUND);
  }
}

function scoreColor(score: number, background: string): string {
  const positiveHue = 122;
  const negativeHue = 0;
  const hue = score >= 0 ? positiveHue : negativeHue;
  const lightness =
    colorDensity(background) < 0.5
      ? 80 - 30 * Math.abs(score)
      : 50 * Math.abs(score);
  return `hsl(${hue}deg 100% ${Math.round(lightness)}%)`;
}
