import {
  Input,
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ApplianceTagComponent } from './appliance-tag/appliance-tag.component';
import { NpPriceWithOffset } from '@shared/np-data';
import { PowerApplianceWithHourlyCosts } from '@shared/appliances';

@Component({
  selector: 'laiks-appliances-costs',
  standalone: true,
  imports: [NgFor, ApplianceTagComponent, NgIf],
  templateUrl: './appliances-costs.component.html',
  styleUrls: ['./appliances-costs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppliancesCostsComponent {
  appliances = signal<PowerApplianceWithHourlyCosts[]>([]);
  @Input('appliances') set appliancesValue(
    value: PowerApplianceWithHourlyCosts[]
  ) {
    this.appliances.set(value);
  }

  price = signal<NpPriceWithOffset | null>(null);
  @Input({ required: true, alias: 'price' }) set pricevalue(
    value: NpPriceWithOffset
  ) {
    this.price.set(value);
  }

  activeAppliances = computed(() => {
    const offset = this.price()?.difference;
    return offset == undefined
      ? []
      : this.appliances()
          .filter((appliance) => appliance.costs.has(offset))
          .slice(0, 2);
  });
}
