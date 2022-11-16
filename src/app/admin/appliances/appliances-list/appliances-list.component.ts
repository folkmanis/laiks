import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';
import { PowerAppliance } from 'src/app/np-data/lib/power-appliance.interface';
import { Observable } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'laiks-appliances-list',
  templateUrl: './appliances-list.component.html',
  styleUrls: ['./appliances-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppliancesListComponent implements OnInit {

  displayColumns = ['enabled', 'name'];

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
