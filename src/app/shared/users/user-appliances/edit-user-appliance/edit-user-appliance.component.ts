import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  effect,
  inject,
  numberAttribute,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ApplianceFormComponent,
  CanComponentDeactivate,
  ConfirmationDialogService,
  INITIAL_APPLIANCE,
  PowerAppliance,
  SystemAppliancesService,
  UsersService,
  throwIfNull,
} from '@shared';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  filter,
  finalize,
  switchMap,
} from 'rxjs';
import {
  AddApplianceDialogComponent,
  ApplianceDialogData,
} from '../add-appliance-dialog/add-appliance-dialog.component';

@Component({
  selector: 'laiks-edit-user-appliance',
  standalone: true,
  templateUrl: './edit-user-appliance.component.html',
  styleUrls: ['./edit-user-appliance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatButtonModule,
    ApplianceFormComponent,
  ],
})
export class EditUserApplianceComponent implements CanComponentDeactivate {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  private usersService = inject(UsersService);
  private systemAppliances = toSignal(
    inject(SystemAppliancesService).getPowerAppliances({ enabledOnly: true }),
    { initialValue: [] }
  );
  private confirmation = inject(ConfirmationDialogService);
  private id$ = new BehaviorSubject('');
  user$ = this.id$.pipe(
    switchMap((id) => (id ? this.usersService.userById(id) : EMPTY)),
    throwIfNull()
  );

  user = toSignal(this.user$);

  @Input() set id(value: string) {
    this.id$.next(value);
  }

  applianceForm = new FormControl<PowerAppliance>(INITIAL_APPLIANCE, {
    nonNullable: true,
  });

  idx = signal<number | null>(null);
  @Input({ alias: 'idx', transform: numberAttribute })
  set idxValue(value: number) {
    this.idx.set(value);
  }

  initialValue = computed(() => {
    const idx = this.idx();
    const user = this.user();
    if (idx == null || isNaN(idx) || user == null) {
      return INITIAL_APPLIANCE;
    } else {
      return user.appliances[idx];
    }
  });

  existingAppliances = computed(() => this.user()?.appliances);

  busy = signal(false);

  constructor() {
    effect(
      () => {
        this.applianceForm.reset(this.initialValue());
      },
      { allowSignalWrites: true }
    );
  }

  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean> =
    () => {
      return this.applianceForm.pristine || this.confirmation.cancelEdit();
    };

  onSave() {
    const idx = this.idx();
    const { appliances, id } = this.user()!;
    if (idx !== null && !isNaN(idx)) {
      appliances[idx] = this.applianceForm.value;
    } else {
      appliances.push(this.applianceForm.value);
    }
    this.usersService
      .updateUser(id, { appliances })
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe(() => {
        this.applianceForm.markAsPristine();
        this.router.navigate(['..'], { relativeTo: this.route });
      });
  }

  onCopyFrom() {
    const config: MatDialogConfig<ApplianceDialogData> = {
      data: {
        appliances: this.systemAppliances,
        locale: this.user()?.locale,
      },
    };
    this.dialog
      .open(AddApplianceDialogComponent, config)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((a: PowerAppliance) => {
        this.applianceForm.reset(a);
        this.applianceForm.markAsDirty();
      });
  }
}
