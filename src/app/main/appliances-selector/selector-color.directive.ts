import { Directive, computed, input } from '@angular/core';
import { colorDensity } from '@shared/utils';

@Directive({
  selector: '[laiksSelectorColor]',
  standalone: true,
  host: {
    '[style.backgroundColor]': 'background()',
    '[style.color]': 'textColor()',
  },
})
export class SelectorColorDirective {
  background = input<string | null>(null, { alias: 'laiksSelectorColor' });

  textColor = computed(() => {
    const background = this.background();
    if (background) {
      return colorDensity(background) > 0.5 ? 'black' : 'white';
    } else {
      return undefined;
    }
  });
}
