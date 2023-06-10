import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';
import { PowerAppliance } from 'src/app/np-data/lib/power-appliance.interface';
import { Observable } from 'rxjs';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'laiks-appliances-list',
    templateUrl: './appliances-list.component.html',
    styleUrls: ['./appliances-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatTableModule, MatButtonModule, RouterLink, MatCheckboxModule, MatIconModule]
})
export class AppliancesListComponent implements OnInit {

  displayColumns = ['color', 'enabled', 'name'];

  appliances$: Observable<PowerAppliance[]> = this.appliancesService.getPowerAppliances();

  constructor(
    private appliancesService: PowerAppliancesService,
  ) { }

  ngOnInit(): void {
  }

  onEnable(event: MatCheckboxChange, id: string) {
    this.appliancesService.updateAppliance(id, { enabled: event.checked })
      .subscribe();
  }

}
