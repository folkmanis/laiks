import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'laiks-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorComponent implements OnDestroy {

  private _value = 0;
  @Input()
  set value(val: number | string) {
    this._value = coerceNumberProperty(val);
  }
  get value(): number {
    return this._value;
  }

  @Output()
  valueChange = new EventEmitter<number>();

  constructor() { }

  ngOnDestroy(): void {
    this.valueChange.complete();
  }

  onButtonPress(val: number): void {
    this.value = this.value + val;
    this.valueChange.next(this.value);
  }

}
