import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

@Component({
    selector: 'laiks-appliance-deleted-snack',
    imports: [MatSnackBarModule],
    templateUrl: './appliance-deleted-snack.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplianceDeletedSnackComponent {
  name = inject(MAT_SNACK_BAR_DATA);
}
