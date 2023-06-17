import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { differenceInHours, isDate, addHours } from 'date-fns';
import { NpPrice, NpPriceOffset } from 'src/app/shared/np-price.interface';
import { PowerAppliance } from 'src/app/shared/power-appliance.interface';
import { PriceCalculatorService } from 'src/app/shared/price-calculator.service';
import { NgIf, DecimalPipe } from '@angular/common';


@Component({
  selector: 'laiks-appliance-consumption',
  templateUrl: './appliance-consumption.component.html',
  styleUrls: ['./appliance-consumption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    DecimalPipe
  ]
})
export class ApplianceConsumptionComponent implements OnInit, OnChanges {

  @Input() appliance: PowerAppliance | undefined;

  @Input() npPrices: NpPriceOffset[] | null = null;

  @Input() timeOffset: number | null = 0;

  timeNow?: Date;
  consumption: number | null = null;

  constructor(
    private calculator: PriceCalculatorService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    this.timeNow = this.npPrices?.find(pr => pr.dateNow)?.dateNow;

    if (this.appliance && this.timeNow && Array.isArray(this.npPrices) && typeof this.timeOffset === 'number') {


      this.consumption = this.calculator.priceTime(
        this.npPrices,
        addHours(this.timeNow, this.timeOffset),
        this.appliance);
    }
    else {
      this.consumption = null;
    }
  }

  ngOnInit(): void {
  }


}
