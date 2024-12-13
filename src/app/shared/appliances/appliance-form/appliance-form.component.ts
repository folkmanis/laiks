import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { PowerAppliance } from '../power-appliance.interface';
import { PowerCyclesComponent } from './power-cycles/power-cycles.component';
import { mapValues, pickBy } from 'lodash-es';

export const INITIAL_APPLIANCE: PowerAppliance = {
  name: '',
  delay: 'start',
  minimumDelay: 0,
  enabled: true,
  color: '#303030',
  cycles: [],
};

type ApplianceFormType = {
  [k in keyof PowerAppliance]: FormControl<PowerAppliance[k]>;
};

export type AppliancesByNameFn = (name: string) => Observable<PowerAppliance[]>;

export const APPLIANCES_BY_NAME = new InjectionToken<AppliancesByNameFn>(
  'By name',
);

@Component({
    selector: 'laiks-appliance-form',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatCheckboxModule,
        PowerCyclesComponent,
        MatDividerModule,
        MatButtonModule,
    ],
    templateUrl: './appliance-form.component.html',
    styleUrls: ['./appliance-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ApplianceFormComponent,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: ApplianceFormComponent,
            multi: true,
        },
    ]
})
export class ApplianceFormComponent implements ControlValueAccessor, Validator {
  private initialValue = INITIAL_APPLIANCE;

  existingAppliances = input<PowerAppliance[]>([]);

  applianceForm: FormGroup<ApplianceFormType> =
    new FormBuilder().nonNullable.group({
      name: [
        this.initialValue.name,
        [Validators.required, this.notDuplicatesValidator()],
      ],
      delay: [this.initialValue.delay],
      minimumDelay: [
        this.initialValue.minimumDelay,
        [Validators.min(0), Validators.required],
      ],
      enabled: [this.initialValue.enabled],
      color: [this.initialValue.color, Validators.required],
      cycles: [this.initialValue.cycles],
    });

  busy = signal(false);

  private onTouchFn: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  formStatus = toSignal(this.applianceForm.statusChanges, {
    initialValue: 'PENDING',
  });
  actionsDisabled = computed(
    () => this.busy() || this.formStatus() !== 'VALID',
  );

  constructor() {
    effect(() => {
      this.existingAppliances() && this.onValidatorChange();
    });
  }
  writeValue(obj: PowerAppliance): void {
    this.applianceForm.reset(obj, { emitEvent: false });
    this.initialValue = obj;
  }

  registerOnChange(fn: (value: Partial<PowerAppliance>) => void): void {
    this.applianceForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.applianceForm.disable();
    } else {
      this.applianceForm.enable();
    }
  }

  validate(): ValidationErrors | null {
    if (this.applianceForm.valid) {
      return null;
    } else {
      const controlsWithError = pickBy(
        this.applianceForm.controls,
        (control) => !control.valid,
      );
      return mapValues(controlsWithError, (control) => control.errors);
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private notDuplicatesValidator(): ValidatorFn {
    return (control) => {
      const current = control.value as string;
      if (
        current === this.initialValue.name ||
        !this.existingAppliances().some(
          (ea) => ea.name.toLocaleUpperCase() === current.toLocaleUpperCase(),
        )
      ) {
        return null;
      } else {
        return {
          duplicate: control.value,
        };
      }
    };
  }
}
