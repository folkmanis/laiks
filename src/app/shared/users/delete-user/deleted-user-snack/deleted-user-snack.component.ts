import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'laiks-deleted-user-snack',
  standalone: true,
  imports: [MatSnackBarModule, MatButtonModule],
  templateUrl: './deleted-user-snack.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletedUserSnackComponent {
  private snackBarRef = inject(MatSnackBarRef);

  data?: string = inject(MAT_SNACK_BAR_DATA);

  onClose() {
    this.snackBarRef.dismiss();
  }
}
