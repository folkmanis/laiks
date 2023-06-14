import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, InjectionToken, Input, Output, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Observable, filter, map, of, take, finalize } from 'rxjs';
import { PowerAppliance } from 'src/app/np-data/lib/power-appliance.interface';
import { ConfirmationDialogService } from '../confirmation-dialog';
import { PowerCyclesComponent } from './power-cycles/power-cycles.component';

type ApplianceFormType = {
  [k in keyof PowerAppliance]: FormControl<PowerAppliance[k]>
};

export const INITIAL_APPLIANCE: PowerAppliance = {
  name: '',
  delay: 'start',
  minimumDelay: 0,
  enabled: true,
  color: '#303030',
  cycles: [],
};


export type AppliancesByNameFn = (name: string) => Observable<PowerAppliance[]>;

export const APPLIANCES_BY_NAME =
  new InjectionToken<AppliancesByNameFn>('By name');

@Component({
  selector: 'laiks-appliance-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatRadioModule,
    MatCheckboxModule,
    PowerCyclesComponent,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './appliance-form.component.html',
  styleUrls: ['./appliance-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplianceFormComponent {

  private _initialValue: PowerAppliance = INITIAL_APPLIANCE;
  @Input() set initialValue(value: PowerAppliance) {
    this._initialValue = value;
    this.applianceForm.reset(this.initialValue, { emitEvent: false });
  }
  get initialValue() {
    return this._initialValue;
  }

  @Input() id: string | null = null;

  @Output() save = new EventEmitter<PowerAppliance>();

  @Output() delete = new EventEmitter<string>();

  @Output() cancel = new EventEmitter<void>();

  applianceForm: FormGroup<ApplianceFormType> = this.nnfb.group({
    name: [
      this.initialValue.name,
      [Validators.required],
      [this.nameAsyncValidator()]
    ],
    delay: [this.initialValue.delay],
    minimumDelay: [
      this.initialValue.minimumDelay,
      [Validators.min(0), Validators.required],
    ],
    enabled: [this.initialValue.enabled],
    color: [this.initialValue.color],
    cycles: [this.initialValue.cycles],
  });

  busy = signal(false);

  formStatus = toSignal(this.applianceForm.statusChanges, { initialValue: 'PENDING' });
  actionsDisabled = computed(() => this.busy() || this.formStatus() !== 'VALID');

  canDeactivate = () => this.applianceForm.pristine ? of(true) : this.confirmation.cancelEdit();


  constructor(
    private nnfb: NonNullableFormBuilder,
    @Inject(APPLIANCES_BY_NAME) private existingAppliances: AppliancesByNameFn,
    private confirmation: ConfirmationDialogService,
  ) { }


  onSubmit() {
    if (!this.applianceForm.valid) {
      return;
    }

    this.busy.set(true);
    const value = this.applianceForm.getRawValue();

    this.save.next(value);

  }

  onDelete() {

    if (!this.id) {
      return;
    }
    this.busy.set(true);

    this.confirmation.delete().pipe(
      filter(resp => resp),
      finalize(() => this.busy.set(false)),
    ).subscribe(() => this.delete.next(this.id!));
  }


  private nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>) => {
      const value = control.value;
      if (value === this.initialValue?.name) {
        return of(null);
      }
      return this.existingAppliances(value).pipe(
        take(1),
        map(appl => appl.length > 0),
        map(res => res ? { duplicate: value } : null)
      );
    };
  }

}
