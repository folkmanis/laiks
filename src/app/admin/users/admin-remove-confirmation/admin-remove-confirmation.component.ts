import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { LaiksUser } from 'src/app/shared/users/laiks-user';

interface DialogData {
  laiksUser: LaiksUser;
}

@Component({
  templateUrl: './admin-remove-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class AdminRemoveConfirmationComponent {
  name =
    inject<DialogData>(MAT_DIALOG_DATA, { optional: true })?.laiksUser.name ||
    '';
}
