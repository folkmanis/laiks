import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PowerAppliancesService } from '../../np-data/lib/power-appliances.service';
import { PowerAppliance } from '../../np-data/lib/power-appliance.interface';
import { Observable } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'laiks-appliances',
  templateUrl: './appliances.component.html',
  styleUrls: ['./appliances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppliancesComponent implements OnInit {

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
