import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { addHours } from 'date-fns';
import { NpDataService, NpPrice } from '../lib/np-data.service';



@Component({
  selector: 'laiks-clock-offset',
  templateUrl: './clock-offset.component.html',
  styleUrls: ['./clock-offset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockOffsetComponent implements OnInit, OnDestroy {

  private observer: (() => void) | null = null;

  @Input() npPrices: NpPrice[] = [];

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

  constructor(
    private npDataService: NpDataService,
    private zone: NgZone,
    private chDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.updateTime();

    this.npDataService.npData$
      .subscribe(data => {
        this.zone.run(() => {
          this.npPrices = data.prices;
          this.chDetector.markForCheck();
        });
      });

    setTimeout(() => this.observer = this.npDataService.connectUpdateTime(), 1000);

  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer();
    }
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
