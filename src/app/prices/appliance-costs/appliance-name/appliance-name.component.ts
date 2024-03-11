import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'laiks-appliance-name',
  standalone: true,
  templateUrl: './appliance-name.component.html',
  styleUrls: ['./appliance-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplianceNameComponent { }
