import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { DEFAULT_PERMISSIONS, PermissionsService } from '@shared/permissions';
import { LaiksUser, UsersService } from '@shared/users';
import { WithId } from '@shared/utils';
import { EMPTY, finalize, mergeMap, switchMap } from 'rxjs';

@Component({
  selector: 'laiks-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, RouterLink],
})
export class UserEditComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private confirm = inject(ConfirmationDialogService);
  private permissionsService = inject(PermissionsService);

  @Input() activeUserId: string | undefined;

  id = signal('');
  @Input('id') set idSet(value: string) {
    this.id.set(value);
  }

  @Input() user?: WithId<LaiksUser>;

  busy = signal(false);

  permissions$ = toObservable(this.id).pipe(
    switchMap((id) =>
      id ? this.permissionsService.getUserPermissions(id) : EMPTY
    )
  );

  permissions = toSignal(this.permissions$, {
    initialValue: DEFAULT_PERMISSIONS,
  });

  onDelete() {
    this.busy.set(true);
    this.confirm
      .delete()
      .pipe(
        mergeMap((resp) =>
          resp ? this.usersService.deleteUser(this.id()) : EMPTY
        ),
        finalize(() => this.busy.set(false))
      )
      .subscribe(() => {
        this.snack.open(`Lietotājs ${this.user?.name} izdzēsts!`, 'OK', {
          duration: 3000,
        });
        this.router.navigateByUrl('/admin/users');
      });
  }

  onSetAdmin(value: boolean) {
    this.busy.set(true);
    this.permissionsService
      .setAdmin(this.id(), value)
      .subscribe(() => this.busy.set(false));
  }

  onSetNpUser(value: boolean) {
    this.busy.set(true);
    this.permissionsService
      .setNpUser(this.id(), value)
      .subscribe(() => this.busy.set(false));
  }
}
