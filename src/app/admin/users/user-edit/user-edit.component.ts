import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, EMPTY, Observer, filter, map, mergeMap, switchMap } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { UsersService } from '../../lib/users.service';
import { AdminRemoveConfirmationComponent } from '../admin-remove-confirmation/admin-remove-confirmation.component';
import { PermissionsAdminService } from '../../lib/permissions-admin.service';
import { Permissions, DEFAULT_PERMISSIONS } from 'src/app/shared/permissions';
import { PermissionsService } from 'src/app/shared/permissions.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'laiks-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    RouterLink,
  ]
})
export class UserEditComponent {

  id = signal('');

  @Input('id') set idSet(value: string) {
    this.id.set(value);
  }

  @Input() user?: LaiksUser;

  busy = signal(false);

  permissions$ = toObservable(this.id).pipe(
    switchMap(id => id ? this.permissionsAdminService.getUserPermissions(id) : EMPTY),
  );

  permissions = toSignal(this.permissions$, { initialValue: DEFAULT_PERMISSIONS });


  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private confirm: ConfirmationDialogService,
    private permissionsAdminService: PermissionsAdminService,
  ) { }

  onDelete() {
    this.busy.set(true);
    this.confirm.delete().pipe(
      mergeMap(resp => resp ? this.usersService.deleteUser(this.id()) : EMPTY),
    )
      .subscribe({
        next: () => this.router.navigate(['..'], { relativeTo: this.route }),
        error: err => this.snack.open(`Neizdevās. ${err}`, 'OK'),
        complete: () => this.busy.set(false),
      });
  }

  onSetAdmin(value: boolean) {
    this.busy.set(true);
    this.permissionsAdminService.setAdmin(this.id(), value)
      .subscribe(() => this.busy.set(false));
  }

  onSetNpUser(value: boolean) {
    this.busy.set(true);
    this.permissionsAdminService.setNpUser(this.id(), value)
      .subscribe(() => this.busy.set(false));
  }

}
