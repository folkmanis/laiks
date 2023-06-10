import { ChangeDetectionStrategy, Inject, Component, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { MatButtonModule } from '@angular/material/button';

interface DialogData {
  laiksUser: LaiksUser,
}

@Component({
    templateUrl: './admin-remove-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatDialogModule, MatButtonModule]
})
export class AdminRemoveConfirmationComponent implements OnInit {

  name = '';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private data?: DialogData,
  ) { }

  ngOnInit(): void {
    this.name = this.data?.laiksUser.name || '';
  }

}
