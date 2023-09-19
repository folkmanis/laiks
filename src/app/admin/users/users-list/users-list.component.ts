import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import {
  LaiksUser,
  UsersService,
  ConfirmationDialogService,
  PermissionsService,
} from '@shared';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, finalize, mergeMap } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  ],
})
export class UsersListComponent {
  private readonly usersService = inject(UsersService);

  private readonly confirmation = inject(ConfirmationDialogService);
  private readonly permissionsService = inject(PermissionsService);

  busy = signal(false);

  @Input() activeUserId: string | undefined;

  users$ = this.usersService.getUsers();

  displayedColumns = ['email', 'verified', 'delete'];
  trackByFn: (index: number, item: LaiksUser) => any = (_, item) => item.email;

  onDelete(id: string) {
    this.busy.set(true);
    this.confirmation
      .delete()
      .pipe(
        mergeMap((resp) => (resp ? this.usersService.deleteUser(id) : EMPTY)),
        mergeMap(() => this.permissionsService.deleteUser(id)),
        finalize(() => this.busy.set(false))
      )
      .subscribe();
  }

  onSetVerified(id: string) {
    this.busy.set(true);
    this.usersService
      .setVerified(id)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe();
  }
}
