import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, EMPTY, mergeMap, Observer } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { UsersService } from '../../lib/users.service';
import { AdminRemoveConfirmationComponent } from '../admin-remove-confirmation/admin-remove-confirmation.component';

@Component({
  selector: 'laiks-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit, CanComponentDeactivate {

  userForm = new FormBuilder().nonNullable.group({
    email: [{ value: '', disabled: true }],
    npAllowed: false,
    verified: false,
    name: '',
    isAdmin: false,
  });

  initialData!: LaiksUser;

  busy$ = new BehaviorSubject(false);

  canDeactivate = () => this.userForm.pristine ? true : this.confirm.cancelEdit();

  private voidObserver: Observer<void> = {
    next: () => {
      this.userForm.reset();
      this.router.navigate(['..'], { relativeTo: this.route });
    },
    error: err => this.snack.open(`Neizdevās. ${err}`, 'OK'),
    complete: () => { this.busy$.next(false); },
  };

  private id!: string;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private confirm: ConfirmationDialogService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id') as string;

    this.initialData = this.route.snapshot.data['user'] as LaiksUser;

    this.userForm.reset(this.initialData);

  }

  onSave() {
    if (!this.userForm.valid) {
      return;
    }

    this.busy$.next(true);

    this.userForm.patchValue({ verified: true }, { emitEvent: false });

    this.usersService.updateUser(this.id, this.userForm.value)
      .subscribe(this.voidObserver);

  }

  onDelete() {

    this.busy$.next(true);
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
