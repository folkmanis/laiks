import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { LocalesService } from '@shared/locales';
import { MarketZonesService } from '@shared/np-data';
import { CanComponentDeactivate } from '@shared/utils';
import { navigateRelative } from '@shared/utils/navigate-relative';
import { reduce } from 'lodash-es';
import { Observable } from 'rxjs';
import { isNpAllowed } from '../is-np-allowed';
import { LaiksUser } from '../laiks-user';
import { UsersService } from '../users.service';
import { EMPTY_USER, UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'laiks-user-settings',
  imports: [
    MatButtonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    UserFormComponent,
  ],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements CanComponentDeactivate {
  private navigate = navigateRelative();
  private usersService = inject(UsersService);
  private confirmation = inject(ConfirmationDialogService);

  id = input.required<string>();

  user = input<LaiksUser>();

  busy = signal(false);

  userControl = new FormControl(EMPTY_USER, {
    nonNullable: true,
  });

  private valueChanges = toSignal(this.userControl.valueChanges, {
    initialValue: this.userControl.value,
  });

  update = computed(() => this.filterUpdate(this.user(), this.valueChanges()));

  npAllowed = isNpAllowed();

  zones = toSignal(inject(MarketZonesService).zonesFlow$, {
    initialValue: [],
  });

  locales = toSignal(inject(LocalesService).getLocalesFlow(), {
    initialValue: [],
  });

  constructor() {
    effect(() => {
      this.userControl.reset(this.user());
    });
  }

  async onSave() {
    const update = this.update();
    const id = this.id();
    if (update == null || !id) {
      return;
    }
    this.busy.set(true);

    await this.usersService.updateUser(id, update);

    this.userControl.markAsPristine();
    this.navigate(['..']);
    this.busy.set(false);
  }

  onReset() {
    this.userControl.reset(this.user());
  }

  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean> = () =>
    this.userControl.pristine || this.confirmation.cancelEdit();

  private filterUpdate<
    T = ReturnType<(typeof this.userControl)['getRawValue']>,
  >(initial: Partial<T> = {}, value: Partial<T>): Partial<T> | null {
    const update = reduce(
      value,
      (result, value, key) =>
        value === initial[key as keyof T]
          ? result
          : { ...result, [key]: value },
      {} as Partial<T>,
    );
    return Object.keys(update).length === 0 ? null : update;
  }
}
