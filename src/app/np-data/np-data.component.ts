import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { addHours, isWithinInterval, subHours } from 'date-fns';
import { NpDataService, NpPrice } from '../lib/np-data.service';

function inInterval(time: Date): (price: NpPrice) => boolean {
  return ({ startTime, endTime }: NpPrice) => isWithinInterval(time, { start: subHours(startTime, 2), end: addHours(endTime, 1) });
}

@Component({
  selector: 'laiks-np-data',
  templateUrl: './np-data.component.html',
  styleUrls: ['./np-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NpDataComponent implements OnInit, OnDestroy {

  private observer: (() => void) | null = null;

  private _time = new Date();
  @Input() set time(value: Date) {
    if (value instanceof Date) {
      this._time = value;
      this.updatePrices();
    }
  }
  get time() {
    return this._time;
  }

  private npPrices: NpPrice[] = [];

  prices: NpPrice[] = [];


  constructor(
    private npDataService: NpDataService,
    private zone: NgZone,
    private chDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.npDataService.npData$
      .subscribe(data => {
        this.zone.run(() => {
          this.npPrices = data.prices;
          this.updatePrices();
        });
      });

    setTimeout(() => this.observer = this.npDataService.connectUpdateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer();
    }
  }

  private updatePrices() {
    this.prices = this.npPrices.filter(inInterval(this.time));
    this.chDetector.markForCheck();
  }

}
