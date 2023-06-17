import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ApplianceDialogData, ApplianceResponse, ApplianceResponseType } from './appliance-dialog-data.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'laiks-add-appliance-dialog',
  standalone: true,
  templateUrl: './add-appliance-dialog.component.html',
  styleUrls: ['./add-appliance-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
})
export class AddApplianceDialogComponent {

  data: ApplianceDialogData = inject(MAT_DIALOG_DATA);

  response(type: ApplianceResponseType, id?: string): ApplianceResponse {
    if (type === 'new' || !id) {
      return { type: 'new' };
    }
    return {
      type, applianceId: id
    };
  }
}
