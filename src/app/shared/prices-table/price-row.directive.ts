import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  Optional,
} from '@angular/core';
import { NpPriceWithOffset } from '@shared';

@Directive({
  selector: 'mat-row[laiksPriceRow],tr[laiksPriceRow]',
  standalone: true,
})
export class PriceRowDirective {
  @HostBinding('class.current') current = false;
  @HostBinding('class.future') future = false;
  @HostBinding('class.past') past = false;

  private _price?: NpPriceWithOffset;
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

  constructor(
    private element: ElementRef<HTMLTableRowElement>,
    @Optional() private scrollable?: CdkScrollable
  ) {}

  scrollIn() {
    this.scrollable?.scrollTo({
      top: this.element.nativeElement.offsetTop - 56,
      behavior: 'smooth',
    });
  }
}
