import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector:
    'input[formControl][laiksNullToZero],input[formControlName][laiksNullToZero]',
  standalone: true,
})
export class NullToZeroDirective {
  private control = inject(NgControl, { self: true });

  @HostListener('blur') onBlur() {
    if (!this.control.control) return;

    const value = this.control.value;

    if (value === null || value === undefined) {
      this.control.control.setValue(0);
    }
  }
}
