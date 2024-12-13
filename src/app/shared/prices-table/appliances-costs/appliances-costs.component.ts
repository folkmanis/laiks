import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { PowerApplianceWithHourlyCosts } from '@shared/appliances';
import { NpPriceWithOffset } from '@shared/np-data';
import { ApplianceTagComponent } from './appliance-tag/appliance-tag.component';

@Component({
    selector: 'laiks-appliances-costs',
    imports: [ApplianceTagComponent],
    templateUrl: './appliances-costs.component.html',
    styleUrls: ['./appliances-costs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppliancesCostsComponent {
  appliances = input<PowerApplianceWithHourlyCosts[]>([]);

  price = input<NpPriceWithOffset | null>(null);

  activeAppliances = computed(() => {
    const offset = this.price()?.difference;
    return offset == undefined
      ? []
      : this.appliances()
          .filter((appliance) => appliance.costs.has(offset))
          .slice(0, 2);
  });
}
