import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Locale } from '@shared/locales';
import { MarketZone } from '@shared/np-data';
import { isNpAllowed } from '@shared/users/is-np-allowed';
import { WithId } from '@shared/utils';
import { LaiksUser } from '../../laiks-user';

type EditableLaiksUserFields = Pick<
  LaiksUser,
  'name' | 'includeVat' | 'vatAmount' | 'marketZoneId' | 'locale'
>;

type UserSettingForm = FormGroup<{
  [key in keyof EditableLaiksUserFields]: FormControl<
    EditableLaiksUserFields[key]
  >;
}>;

export const EMPTY_USER: EditableLaiksUserFields = {
  name: '',
  includeVat: true,
  vatAmount: 0,
  marketZoneId: 'LV',
  locale: 'lv',
};

@Component({
  selector: 'laiks-user-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: UserFormComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: UserFormComponent, multi: true },
  ],
})
export class UserFormComponent implements ControlValueAccessor, Validator {
  userForm: UserSettingForm = inject(NonNullableFormBuilder).group({
    name: [EMPTY_USER.name, Validators.required],
    includeVat: [EMPTY_USER.includeVat],
    vatAmount: [EMPTY_USER.vatAmount, Validators.required],
    marketZoneId: [EMPTY_USER.marketZoneId, Validators.required],
    locale: [EMPTY_USER.locale, Validators.required],
  });

  zones = input<WithId<MarketZone>[]>([]);

  locales = input<WithId<Locale>[]>([]);

  npAllowed = isNpAllowed();

  writeValue(obj: LaiksUser): void {
    this.userForm.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.userForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(): void {}

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.userForm.disable();
    } else {
      this.userForm.enable();
    }
  }

  validate(): ValidationErrors | null {
    return this.userForm.valid ? null : { invalid: this.userForm.errors };
  }

  onZoneChange(id: string) {
    const newZone = this.zones()?.find((zone) => zone.id === id);
    if (newZone) {
      this.userForm.controls.vatAmount.setValue(newZone.tax);
    }
  }
}
