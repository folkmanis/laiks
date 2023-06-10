import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: 'input[formControl][laiksNullToZero],input[formControlName][laiksNullToZero]',
    standalone: true
})
export class NullToZeroDirective {


  constructor(
    private control: NgControl
  ) { }

  @HostListener('blur') onBlur() {

    if (!this.control.control) return;

    const value = this.control.value;

    if (value === null || value === undefined) {
      this.control.control.setValue(0);
    }

  }

}
