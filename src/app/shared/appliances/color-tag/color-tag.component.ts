import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export const DEFAULT_COLOR = 'rgba(255, 255, 255, 0.5)';

@Component({
  selector: 'laiks-color-tag',
  standalone: true,
  template: ``,
  styleUrls: ['./color-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.backgroundColor]': 'styleColor()',
  },
})
export class ColorTagComponent {
  color = input<string | null>(null);
  styleColor = computed(() => this.color() || DEFAULT_COLOR);
}
