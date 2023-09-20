import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { DEFAULT_PERMISSIONS, PermissionsService } from '@shared/permissions';
import { LaiksUser, UsersService } from '@shared/users';
import { EMPTY, mergeMap, switchMap } from 'rxjs';

@Component({
  selector: 'laiks-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, RouterLink],
})
export class UserEditComponent {
  @Input() activeUserId: string | undefined;

  id = signal('');
  @Input('id') set idSet(value: string) {
    this.id.set(value);
  }

  @Input() user?: LaiksUser;

  busy = signal(false);

  permissions$ = toObservable(this.id).pipe(
    switchMap((id) =>
      id ? this.permissionsService.getUserPermissions(id) : EMPTY
    )
  );

  permissions = toSignal(this.permissions$, {
    initialValue: DEFAULT_PERMISSIONS,
  });

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private confirm: ConfirmationDialogService,
    private permissionsService: PermissionsService
  ) {}

  onDelete() {
    this.busy.set(true);
    this.confirm
      .delete()
      .pipe(
        mergeMap((resp) =>
          resp ? this.usersService.deleteUser(this.id()) : EMPTY
        )
      )
      .subscribe({
        next: () => this.router.navigate(['..'], { relativeTo: this.route }),
        error: (err) => this.snack.open(`Neizdevās. ${err}`, 'OK'),
        complete: () => this.busy.set(false),
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
