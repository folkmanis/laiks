import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addHours } from 'date-fns';
import { coerceBooleanProperty } from '@angular/cdk/coercion';



@Component({
  selector: 'laiks-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {


  private _currentTime = new Date();
  @Input()
  set currentTime(value: Date | null) {
    if (value instanceof Date) {
      this._currentTime = value;
      this.updateTime();
    }
  }
  get currentTime(): Date {
    return this._currentTime;
  }

  timeWithOffset!: Date;

  @Input() offset = 0;

  private _npAllowed: boolean = false;
  @Input()
  set npAllowed(value: unknown) {
    this._npAllowed = coerceBooleanProperty(value);
  }
  get npAllowed() {
    return this._npAllowed;
  }

  @Output() offsetChange = new EventEmitter<number>();

  constructor(
  ) { }

  ngOnInit(): void {
    this.updateTime();
  }


  onOffsetChange(value: number) {
    this.offset = value;
    this.updateTime();
    this.offsetChange.next(this.offset);
  }

  private updateTime() {
    this.timeWithOffset = addHours(this.currentTime, this.offset);
  }


}
