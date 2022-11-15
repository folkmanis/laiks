import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { differenceInHours, isDate } from 'date-fns';
import { NpPrice } from '../lib/np-price.interface';
import { PowerAppliance } from '../lib/power-appliance.interface';
import { PriceCalculatorService } from '../lib/price-calculator.service';

@Component({
  selector: 'laiks-appliance-consumption',
  templateUrl: './appliance-consumption.component.html',
  styleUrls: ['./appliance-consumption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplianceConsumptionComponent implements OnInit, OnChanges {

  @Input() appliance: PowerAppliance | undefined;

  @Input() time: Date = new Date(0);

  @Input() npPrices: NpPrice[] = [];

  @Input() timeOffset: number = 0;;

  consumption: number | null = null;
  best: { offset: number, price: number; } | null = null;

  constructor(
    private calculator: PriceCalculatorService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.appliance && isDate(this.time) && Array.isArray(this.npPrices)) {

      if (this.timeOffset >= this.appliance.minimumDelay) {
        this.consumption = this.calculator.priceTime(this.npPrices, this.time, this.appliance);
      } else {
        this.consumption = null;
      }

      this.best = this.calculator.bestOffset(this.npPrices, new Date(), this.appliance);

    } else {
      this.consumption = null;
      this.best = null;
    }
  }

  ngOnInit(): void {
  }


}
