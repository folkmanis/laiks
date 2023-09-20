import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { reduce } from 'lodash-es';
import { Observable, finalize } from 'rxjs';
import { UserFormComponent, EMPTY_USER } from './user-form/user-form.component';
import { UsersService } from '../users.service';
import { MarketZonesService } from '@shared/np-data';
import { LoginService } from '../login.service';
import { LocalesService } from '@shared/locales.service';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { CanComponentDeactivate } from '@shared/utils';
import { LaiksUser } from '../laiks-user';

@Component({
  selector: 'laiks-user-settings',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    UserFormComponent,
  ],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements CanComponentDeactivate {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private confirmation = inject(ConfirmationDialogService);
  private initialValue?: LaiksUser;

  @Input() id?: string;

  @Input() set user(value: LaiksUser) {
    this.initialValue = value;
    this.userControl.reset(this.initialValue);
  }

  busy = signal(false);

  get email() {
    return this.initialValue?.email;
  }

  userControl = new FormControl(EMPTY_USER, {
    nonNullable: true,
  });

  private valueChanges = toSignal(this.userControl.valueChanges, {
    initialValue: this.userControl.value,
  });

  update = computed(() =>
    this.filterUpdate(this.initialValue, this.valueChanges())
  );

  npAllowed = toSignal(inject(LoginService).isNpAllowed());

  zones = toSignal(inject(MarketZonesService).getZonesFlow());

  locales = toSignal(inject(LocalesService).getLocales());

  onSave() {
    const update = this.update();
    const id = this.id;
    if (update == null || !id) {
      return;
    }
    this.busy.set(true);
    this.usersService
      .updateUser(id, update)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe(() => {
        this.userControl.markAsPristine();
        this.router.navigate(['..'], { relativeTo: this.route });
      });
  }

  onReset() {
    this.userControl.reset(this.initialValue);
  }

  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean> = () =>
    this.userControl.pristine || this.confirmation.cancelEdit();

  private filterUpdate<
    T = ReturnType<(typeof this.userControl)['getRawValue']>
  >(initial: Partial<T> = {}, value: Partial<T>): Partial<T> | null {
    const update = reduce(
      value,
      (result, value, key) =>
        value === initial[key as keyof T]
          ? result
          : { ...result, [key]: value },
      {} as Partial<T>
    );
    return Object.keys(update).length === 0 ? null : update;
  }
}
