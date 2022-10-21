import { Output, ChangeDetectionStrategy, Component, OnInit, Input, EventEmitter } from '@angular/core';
import { addHours } from 'date-fns';

@Component({
  selector: 'laiks-clock-offset',
  templateUrl: './clock-offset.component.html',
  styleUrls: ['./clock-offset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockOffsetComponent implements OnInit {


  @Input()
  currentTime: Date = new Date();

  timeWithOffset!: Date;

  private _offset = 0;
  @Input()
  set offset(value: number) {
    this._offset = value;
    this.updateTime();
    this.offsetChange.next(this.offset);
  }
  get offset() {
    return this._offset;
  }

  @Output()
  offsetChange = new EventEmitter<number>();

  ngOnInit(): void {
    this.updateTime();
  }

  private updateTime() {
    this.timeWithOffset = addHours(this.currentTime, this.offset);
  }


}
