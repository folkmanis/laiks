import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

interface YesNoDialogData {
  text?: string;
  title?: string;
}
@Component({
  selector: 'laiks-yes-no-confirmation',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './yes-no-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YesNoConfirmationComponent {
  data?: YesNoDialogData = inject(DIALOG_DATA, { optional: true });
}
