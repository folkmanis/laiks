import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { NpPriceOffset } from 'src/app/shared/np-price.interface';
import { PowerApplianceWithBestOffset } from 'src/app/shared/power-appliance.interface';


@Component({
  selector: 'laiks-appliance-price',
  templateUrl: './appliance-price.component.html',
  styleUrls: ['./appliance-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, MatChipsModule, NgFor]
})
export class AppliancePriceComponent implements OnChanges {

  @Input() price: NpPriceOffset | undefined;

  @Input() appliances: PowerApplianceWithBestOffset[] | null = null;

  bestAppliances: PowerApplianceWithBestOffset[] | null = null;

  ngOnChanges(): void {

    if (!this.price || !Array.isArray(this.appliances)) {
      this.bestAppliances = null;
      return;
    }
    const best = this.appliances
      .filter(appliance => appliance.bestOffset?.offset === this.price?.difference);
    this.bestAppliances = best.length > 0 ? best : null;
  }

}
