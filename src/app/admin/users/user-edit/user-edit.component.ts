import { OnDestroy, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { UsersService } from '../../lib/users.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, map, tap, mergeMap, Observable, take, Observer } from 'rxjs';
import { throwIfNull } from 'src/app/shared/throw-if-null';

@Component({
  selector: 'laiks-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit, OnDestroy {

  userForm = this.nnfb.group({
    email: [{ value: '', disabled: true }],
    npAllowed: false,
    verified: false,
    name: '',
    isAdmin: false,
  });

  id$: Observable<string> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    throwIfNull(),
  );

  laiksUser$: Observable<LaiksUser> = this.route.data.pipe(
    map(data => data['user'] as LaiksUser | undefined),
    throwIfNull(),
  );

  private subs?: Subscription;

  private voidObserver: Observer<void> = {
    next: () => {
      this.userForm.reset();
      this.router.navigate(['..'], { relativeTo: this.route });
    },
    error: err => this.snack.open(`Neizdevās. ${err}`, 'OK'),
    complete: () => { },
  };

  constructor(
    private nnfb: NonNullableFormBuilder,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.subs = this.laiksUser$.subscribe(user => this.userForm.reset(user));
  }

  ngOnDestroy(): void {
    this.subs && this.subs.unsubscribe();
  }

  onSave() {
    if (!this.userForm.valid) {
      return;
    }

    this.userForm.patchValue({ verified: true }, { emitEvent: false });

    this.id$.pipe(
      take(1),
      mergeMap(id => this.usersService.updateUser(id, this.userForm.value)),
    ).subscribe(this.voidObserver);

  }

  onDelete() {
    this.id$.pipe(
      take(1),
      mergeMap(id => this.usersService.deleteUser(id)),
    ).subscribe(this.voidObserver);
  }

}
