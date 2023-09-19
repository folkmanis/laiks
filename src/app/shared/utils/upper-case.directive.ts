import { Directive, HostBinding } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive({
  selector: '[formControl][laiksUpperCase],[formControlName][laiksUpperCase]',
  standalone: true
})
export class UpperCaseDirective {

  @HostBinding('style.text-transform') uppercase = 'uppercase';

  constructor(
    ngControl: NgControl,
  ) {
    upperCaseAccessor(ngControl.valueAccessor!);
  }

}

function upperCaseAccessor(valueAccessor: ControlValueAccessor) {

  const original = valueAccessor.registerOnChange;

  valueAccessor.registerOnChange = (fn: (value: unknown) => void) => {
    return original.call(valueAccessor, (value: unknown) => {
      return fn(typeof value === 'string' ? value.toUpperCase() : value);
    });
  };
}
