import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { addHours, isDate, isWithinInterval, subHours } from 'date-fns';
import { NpDataService, NpPrice } from './lib/np-data.service';
import { dishwasher, washer } from './lib/power-appliances';


@Component({
  selector: 'laiks-np-data',
  templateUrl: './np-data.component.html',
  styleUrls: ['./np-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NpDataComponent implements OnInit, OnDestroy {

  private observer: (() => void) | null = null;


  private _time = new Date(0);
  @Input() set time(value: Date) {
    if (isDate(value)) {
      this._time = value;
    }
  };
  get time() {
    return this._time;
  }

  private _npPrices: NpPrice[] = [];
  @Input() set npPrices(value: NpPrice[]) {
    if (Array.isArray(value)) {
      this._npPrices = value;
    }
  }
  get npPrices() {
    return this._npPrices;
  }


  washer = washer;
  dishwasher = dishwasher;



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
          this.chDetector.markForCheck();
        });
      });

    setTimeout(() => this.observer = this.npDataService.connectUpdateTime(), 500);

  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer();
    }
  }



}
