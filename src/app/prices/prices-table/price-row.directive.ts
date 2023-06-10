import { ElementRef, Directive, Input, HostBinding, Optional } from '@angular/core';
import { NpPriceOffset } from '../../np-data/lib/np-price.interface';
import { CdkScrollable } from '@angular/cdk/scrolling';


@Directive({
    selector: 'tr[laiksPriceRow]',
    standalone: true
})
export class PriceRowDirective {


  @HostBinding('class.current') current = false;
  @HostBinding('class.future') future = false;
  @HostBinding('class.past') past = false;

  private _price?: NpPriceOffset;
  @Input('laiksPriceRow')
  set price(value: NpPriceOffset | undefined) {
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
    @Optional() private scrollable?: CdkScrollable,
  ) { }

  scrollIn() {
    this.scrollable?.scrollTo({
      top: this.element.nativeElement.offsetTop - 56,
      behavior: 'smooth'
    });
  }


}
