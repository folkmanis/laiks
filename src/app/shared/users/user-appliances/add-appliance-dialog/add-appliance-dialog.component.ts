import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import {
  LocalizedApplianceNamePipe,
  PresetPowerAppliance,
} from '@shared/appliances';
import { WithId } from '@shared/utils';
import { SelectApplianceDirective } from './select-appliance.directive';

export interface ApplianceDialogData {
  appliances: Signal<WithId<PresetPowerAppliance>[]>;
  locale?: string;
}

@Component({
  selector: 'laiks-add-appliance-dialog',
  standalone: true,
  templateUrl: './add-appliance-dialog.component.html',
  styleUrls: ['./add-appliance-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    SelectApplianceDirective,
    LocalizedApplianceNamePipe,
  ],
})
export class AddApplianceDialogComponent {
  private readonly dialogData = inject<ApplianceDialogData>(MAT_DIALOG_DATA);

  appliances = this.dialogData.appliances;
  locale = this.dialogData.locale;
}
