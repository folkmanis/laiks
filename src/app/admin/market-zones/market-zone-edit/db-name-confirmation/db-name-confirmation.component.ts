import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'laiks-db-name-confirmation',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './db-name-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DbNameConfirmationComponent {}
