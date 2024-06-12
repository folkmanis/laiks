import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import {
  ApplianceFormComponent,
  INITIAL_APPLIANCE,
  PowerAppliance,
  SystemAppliancesService,
} from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import {
  CanComponentDeactivate,
  assertNotNull,
  throwIfNull,
} from '@shared/utils';
import { navigateRelative } from '@shared/utils/navigate-relative';
import { EMPTY, firstValueFrom, switchMap } from 'rxjs';
import { UsersService } from '../../users.service';
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
    MatButtonModule,
    ApplianceFormComponent,
  ],
  host: {
    class: 'vertical-container',
  },
})
export class EditUserApplianceComponent implements CanComponentDeactivate {
  private dialog = inject(MatDialog);
  private navigate = navigateRelative();
  private confirmation = inject(ConfirmationDialogService);

  private usersService = inject(UsersService);
  private systemAppliances = toSignal(
    inject(SystemAppliancesService).getPowerAppliances({ enabledOnly: true }),
    { initialValue: [] },
  );

  id = input.required<string>();

  user$ = toObservable(this.id).pipe(
    switchMap((id) => (id ? this.usersService.userByIdFlow(id) : EMPTY)),
    throwIfNull(),
  );

  user = toSignal(this.user$);

  applianceForm = new FormControl<PowerAppliance>(INITIAL_APPLIANCE, {
    nonNullable: true,
  });

  idx = input<number | null, number | null>(null, {
    transform: numberAttribute,
  });

  isNew = computed(() => {
    const idx = this.idx();
    return idx === null || isNaN(idx);
  });

  initialValue = computed(() => {
    const idx = this.idx();
    const user = this.user();
    if (idx == null || isNaN(idx) || user == null) {
      return INITIAL_APPLIANCE;
    } else {
      return user.appliances[idx];
    }
  });

  existingAppliances = computed(() => this.user()?.appliances || []);

  busy = signal(false);

  constructor() {
    effect(() => this.applianceForm.reset(this.initialValue()), {
      allowSignalWrites: true,
    });
  }

  canDeactivate = () =>
    this.applianceForm.pristine || this.confirmation.cancelEdit();

  async onSave() {
    const idx = this.idx();
    const user = this.user();
    assertNotNull(user);

    const appliances = user.appliances ?? [];
    if (idx !== null && !isNaN(idx)) {
      appliances[idx] = this.applianceForm.value;
    } else {
      appliances.push(this.applianceForm.value);
    }

    this.busy.set(true);

    await this.usersService.updateUser(user.id, { appliances });

    this.busy.set(false);
    this.applianceForm.markAsPristine();
    this.navigate(['..']);
  }

  async onCopyFrom() {
    const config: MatDialogConfig<ApplianceDialogData> = {
      data: {
        appliances: this.systemAppliances,
        locale: this.user()?.locale,
      },
    };
    const dialogRef = this.dialog.open<
      AddApplianceDialogComponent,
      ApplianceDialogData,
      PowerAppliance
    >(AddApplianceDialogComponent, config);
    const appliance = await firstValueFrom(dialogRef.afterClosed());
    if (appliance) {
      this.applianceForm.reset(appliance);
      this.applianceForm.markAsDirty();
    }
  }
}
