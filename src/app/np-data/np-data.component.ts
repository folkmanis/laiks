import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { isDate } from 'date-fns';
import { Observable } from 'rxjs';
import { NpDataService, NpPrice } from './lib/np-data.service';
import { PowerAppliance } from './lib/power-appliance.interface';
import { PowerAppliancesService } from './lib/power-appliances.service';


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

  appliances$!: Observable<PowerAppliance[]>;

  constructor(
    private npDataService: NpDataService,
    private zone: NgZone,
    private chDetector: ChangeDetectorRef,
    private appliancesService: PowerAppliancesService,
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

    this.appliances$ = this.appliancesService.getPowerAppliances();

  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer();
    }
  }



}
