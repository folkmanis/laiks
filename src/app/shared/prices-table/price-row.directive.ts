import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  inject,
} from '@angular/core';
import { NpPriceWithOffset } from '@shared/np-data';

@Directive({
  selector: 'mat-row[laiksPriceRow],tr[laiksPriceRow]',
  standalone: true,
})
export class PriceRowDirective {
  private element = inject<ElementRef<HTMLTableRowElement>>(ElementRef);
  private scrollable? = inject(CdkScrollable, { optional: true });

  private _price?: NpPriceWithOffset;

  @HostBinding('class.current') current = false;
  @HostBinding('class.future') future = false;
  @HostBinding('class.past') past = false;

  @Input('laiksPriceRow')
  set price(value: NpPriceWithOffset | undefined) {
    if (!value) {
      return;
    }
    this._price = value;
    this.current = value.difference === 0;
    this.future = value.difference > 0;
    this.past = value.difference < 0;
  }
  get price() {
    return this._price;
  }

  scrollIn() {
    this.scrollable?.scrollTo({
      top: this.element.nativeElement.offsetTop - 56,
      behavior: 'smooth',
    });
  }
}
