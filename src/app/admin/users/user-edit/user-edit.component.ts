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
import { EMPTY, Observer, mergeMap } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { UsersService } from '../../lib/users.service';
import { AdminRemoveConfirmationComponent } from '../admin-remove-confirmation/admin-remove-confirmation.component';

@Component({
  selector: 'laiks-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink,
  ]
})
export class UserEditComponent implements CanComponentDeactivate {

  userForm = this.nnfb.group({
    email: [{ value: '', disabled: true }],
    npAllowed: false,
    verified: false,
    name: '',
    isAdmin: false,
  });

  initialData!: LaiksUser;

  busy = signal(false);

  canDeactivate = () => this.userForm.pristine ? true : this.confirm.cancelEdit();

  private voidObserver: Observer<void> = {
    next: () => {
      this.userForm.reset();
      this.router.navigate(['..'], { relativeTo: this.route });
    },
    error: err => this.snack.open(`Neizdevās. ${err}`, 'OK'),
    complete: () => { this.busy.set(false); },
  };

  @Input() id!: string;

  @Input() set user(value: LaiksUser) {
    this.initialData = value;
    this.userForm.reset(this.initialData);
  }

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private confirm: ConfirmationDialogService,
    private dialog: MatDialog,
    private nnfb: NonNullableFormBuilder,
  ) { }


  onSave() {
    if (!this.userForm.valid) {
      return;
    }

    this.busy.set(true);

    this.userForm.patchValue({ verified: true }, { emitEvent: false });

    this.usersService.updateUser(this.id, this.userForm.value)
      .subscribe(this.voidObserver);

  }

  onDelete() {

    this.busy.set(true);
    this.confirm.delete().pipe(
      mergeMap(resp => resp ? this.usersService.deleteUser(this.id) : EMPTY),
    )
      .subscribe(this.voidObserver);
  }

  onIsAdmin(checked: boolean) {
    if (this.initialData.isAdmin === true && checked === false) {
      this.dialog.open(AdminRemoveConfirmationComponent, { data: { laiksUser: this.initialData }, maxWidth: '350px' })
        .afterClosed()
        .subscribe(resp => resp || this.userForm.controls.isAdmin.reset(true));
    }
  }

}
