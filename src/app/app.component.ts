import { OnInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { addHours } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  timeWithOffset!: Date;

  currentTime: Date = new Date();

  private _timeOffset = 0;
  get timeOffset() {
    return this._timeOffset;
  }
  set timeOffset(value: number) {
    this._timeOffset = value;
    this.updateTime();
  }

  ngOnInit(): void {
    this.updateTime();
  }

  private updateTime() {
    this.timeWithOffset = addHours(this.currentTime, this.timeOffset);
  }

}
