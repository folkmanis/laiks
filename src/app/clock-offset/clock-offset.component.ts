import { Output, ChangeDetectionStrategy, Component, OnInit, Input, EventEmitter } from '@angular/core';
import { addHours } from 'date-fns';

@Component({
  selector: 'laiks-clock-offset',
  templateUrl: './clock-offset.component.html',
  styleUrls: ['./clock-offset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockOffsetComponent implements OnInit {


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

  @Output() offsetChange = new EventEmitter<number>();

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
