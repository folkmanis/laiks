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
import { LaiksUser, UsersService } from '@shared/users';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, finalize, mergeMap } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { PermissionsService } from '@shared/permissions';

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

  busy = signal(false);

  users$ = this.usersService.getUsers();

  displayedColumns = ['email', 'verified', 'edit'];
  trackByFn: (index: number, item: LaiksUser) => any = (_, item) => item.email;

  onSetVerified(id: string) {
    this.busy.set(true);
    this.usersService
      .setVerified(id)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe();
  }
}
