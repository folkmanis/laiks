import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { PowerAppliance } from '@shared/appliances';
import { SelectorColorDirective } from './selector-color.directive';

@Component({
  selector: 'laiks-appliances-selector',
  standalone: true,
  imports: [RouterLink, MatButtonModule, SelectorColorDirective],
  templateUrl: './appliances-selector.component.html',
  styleUrls: ['./appliances-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppliancesSelectorComponent {
  appliances = input<PowerAppliance[]>([]);

  firstAppliances = computed(() => this.appliances().slice(0, 2));

}
