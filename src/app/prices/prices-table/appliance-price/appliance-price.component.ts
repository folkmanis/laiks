import { Input, ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { NpPrice, NpPriceOffset } from 'src/app/np-data/lib/np-price.interface';
import { PowerAppliance, PowerApplianceWithBestOffset } from 'src/app/np-data/lib/power-appliance.interface';


@Component({
  selector: 'laiks-appliance-price',
  templateUrl: './appliance-price.component.html',
  styleUrls: ['./appliance-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppliancePriceComponent implements OnChanges {

  @Input() price: NpPriceOffset | undefined;

  @Input() appliances: PowerApplianceWithBestOffset[] | null = null;

  bestAppliances: PowerApplianceWithBestOffset[] | null = null;

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.price || !Array.isArray(this.appliances)) {
      this.bestAppliances = null;
      return;
    }
    const best = this.appliances
      .filter(appliance => appliance.bestOffset?.offset === this.price?.difference);
    this.bestAppliances = best.length > 0 ? best : null;
  }

}
