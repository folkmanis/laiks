import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  Directive,
  ElementRef,
  HostBinding,
  effect,
  inject,
  input
} from '@angular/core';
import { NpPriceWithOffset } from '@shared/np-data';

@Directive({
  selector: 'mat-row[laiksPriceRow],tr[laiksPriceRow]',
  standalone: true,
})
export class PriceRowDirective {
  private element = inject<ElementRef<HTMLTableRowElement>>(ElementRef);
  private scrollable? = inject(CdkScrollable, { optional: true });

  @HostBinding('class.current') current = false;
  @HostBinding('class.future') future = false;
  @HostBinding('class.past') past = false;

  price = input.required<NpPriceWithOffset>({ alias: 'laiksPriceRow' });

  constructor() {
    effect(() => {
      this.current = this.price().difference === 0;
      this.future = this.price().difference > 0;
      this.past = this.price().difference < 0;
    });
  }

  scrollIn() {
    this.scrollable?.scrollTo({
      top: this.element.nativeElement.offsetTop - 56,
      behavior: 'smooth',
    });
  }
}
