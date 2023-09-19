import { Directive, Input, HostBinding } from '@angular/core';
import { colorDensity } from '@shared';


@Directive({
  selector: '[laiksSelectorColor]',
  standalone: true,

})
export class SelectorColorDirective {

  @HostBinding('style.backgroundColor')
  @Input('laiksSelectorColor') background?: string | null;

  @HostBinding('style.color')
  get textColor() {
    const backg = this.background;
    if (typeof backg === 'string') {
      return colorDensity(backg) > 0.5 ? 'black' : 'white';
    } else {
      return undefined;
    }

  }

}
