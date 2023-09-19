import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'laiks-appliance-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appliance-name.component.html',
  styleUrls: ['./appliance-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplianceNameComponent {


}
