import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';
import { colorDensity } from '@shared/utils';

const BACKGROUND = '#424242';

@Component({
  selector: 'laiks-price-colored',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './price-colored.component.html',
  styleUrls: ['./price-colored.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.color]': 'color()' },
})
export class PriceColoredComponent {

  value = input.required<number>();

  average = input<number | null>(null);

  stDev = input<number | null>(null);

  color = computed(() => {
    const score = getScore(this.value(), this.average(), this.stDev());
    return scoreColor(score, BACKGROUND);
  });

}

function getScore(value: number, average: number | null, stDev: number | null): number {
  if (typeof stDev !== 'number' || typeof average !== 'number') {
    return 0;
  }
  const score = (average - value) / stDev; // .coerceIn(-1.0, 1.0)
  if (score < -1) return -1;
  if (score > 1) return 1;
  return score;

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
