import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { UsersAdminService } from '../../lib/users-admin.service';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { EMPTY, finalize, mergeMap } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LaiksUser } from 'src/app/shared/laiks-user';

@Component({
  selector: 'laiks-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatCheckboxModule,
  ]
})
export class UsersListComponent {

  busy = signal(false);

  @Input() activeUserId: string | undefined;

  private readonly usersAdminService = inject(UsersAdminService);

  private readonly confirmation = inject(ConfirmationDialogService);

  dataSource$ = this.usersAdminService.getUsers();

  displayedColumns = ['email', 'verified', 'delete'];
  trackByFn: (index: number, item: LaiksUser) => any = (_, item) => item.email;

  onDelete(id: string) {
    this.busy.set(true);
    this.confirmation.delete().pipe(
      mergeMap(resp => resp ? this.usersAdminService.deleteUser(id) : EMPTY),
      finalize(() => this.busy.set(false)),
    )
      .subscribe();
  }

  onSetVerified(id: string) {
    this.busy.set(true);
    this.usersAdminService.setVerified(id)
      .subscribe(() => this.busy.set(false));
  }


}
