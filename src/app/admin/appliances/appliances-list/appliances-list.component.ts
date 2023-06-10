import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { PowerAppliance } from 'src/app/np-data/lib/power-appliance.interface';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';

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
    MatIconModule
  ],
})
export class AppliancesListComponent {

  displayColumns = ['color', 'enabled', 'name'];

  appliances$: Observable<PowerAppliance[]> = this.appliancesService.getPowerAppliances();

  constructor(
    private appliancesService: PowerAppliancesService,
  ) { }

  onEnable(event: MatCheckboxChange, id: string) {
    this.appliancesService.updateAppliance(id, { enabled: event.checked })
      .subscribe();
  }

}
