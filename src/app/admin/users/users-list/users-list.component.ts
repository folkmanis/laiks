import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { LaiksUser, LoginService, UsersService } from '@shared/users';
import { WithId } from '@shared/utils';
import { combineLatest, map } from 'rxjs';

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
  private readonly confirmation = inject(ConfirmationDialogService);

  private readonly usersService = inject(UsersService);
  private readonly loginService = inject(LoginService);

  private users$ = combineLatest([
    this.usersService.getUsersFlow(),
    this.loginService.userObserver(),
  ]).pipe(
    map(([laiksUsers, user]) =>
      laiksUsers.filter((laiksUser) => laiksUser.id !== user?.uid)
    )
  );

  users = toSignal(this.users$, { initialValue: [] });

  userSelection = new SelectionModel<WithId<LaiksUser>>(true);

  displayedColumns = ['selection', 'email', 'edit'];

  trackByFn: (index: number, item: LaiksUser) => string = (_, item) => item.email;

  constructor() {
    effect(() => {
      this.users();
      this.resetSelection();
    });
  }

  isAllSelected() {
    return this.userSelection.selected.length === this.users().length;
  }

  toggleAll() {
    this.isAllSelected()
      ? this.userSelection.clear()
      : this.userSelection.setSelection(...this.users());
  }

  async onDeleteSelected() {
    if (this.userSelection.isEmpty()) {
      return;
    }
    const selectedIds = this.userSelection.selected.map((user) => user.id);
    const confirmation = await this.confirmation.delete();
    confirmation && await this.usersService.deleteUsers(selectedIds);
  }

  private resetSelection() {
    this.userSelection.clear();
  }
}
