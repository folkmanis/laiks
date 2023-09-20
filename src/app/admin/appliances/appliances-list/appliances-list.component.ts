import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { PowerAppliance, SystemAppliancesService } from '@shared/appliances';
import { Observable } from 'rxjs';

@Component({
  selector: 'laiks-appliances-list',
  templateUrl: './appliances-list.component.html',
  styleUrls: ['./appliances-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatCheckboxModule,
    MatIconModule,
  ],
})
export class AppliancesListComponent {
  displayColumns = ['color', 'enabled', 'name'];

  private appliancesService = inject(SystemAppliancesService);

  appliances$: Observable<PowerAppliance[]> =
    this.appliancesService.getPowerAppliances();

  onEnable(event: MatCheckboxChange, id: string) {
    this.appliancesService
      .updateAppliance(id, { enabled: event.checked })
      .subscribe();
  }
}
