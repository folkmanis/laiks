import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  Directive,
  ElementRef,
  computed,
  inject,
  input
} from '@angular/core';
import { NpPriceWithOffset } from '@shared/np-data';

@Directive({
  selector: 'mat-row[laiksPriceRow],tr[laiksPriceRow]',
  standalone: true,
  host: {
    '[class.current]': 'current()',
    '[class.future]': 'future()',
    '[class.past]': 'past()',
  }
})
export class PriceRowDirective {
  private element = inject<ElementRef<HTMLTableRowElement>>(ElementRef);
  private scrollable? = inject(CdkScrollable, { optional: true });

  price = input.required<NpPriceWithOffset>({ alias: 'laiksPriceRow' });

  current = computed(() => this.price().difference === 0);
  future = computed(() => this.price().difference > 0);
  past = computed(() => this.price().difference < 0);


  scrollIn() {
    this.scrollable?.scrollTo({
      top: this.element.nativeElement.offsetTop - 56,
      behavior: 'smooth',
    });
  }
}
