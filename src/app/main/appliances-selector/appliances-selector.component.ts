import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { PowerAppliance } from '@shared';
import { SelectorColorDirective } from "./selector-color.directive";

@Component({
  selector: 'laiks-appliances-selector',
  standalone: true,
  imports: [NgFor, RouterLink, MatButtonModule, SelectorColorDirective],
  templateUrl: './appliances-selector.component.html',
  styleUrls: ['./appliances-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppliancesSelectorComponent {
  @Input() appliances?: PowerAppliance[] | null;

  get firstAppliances() {
    return this.appliances?.slice(0, 2);
  }
}
