import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, Observer, map, mergeMap, of, take } from 'rxjs';
import { PowerAppliance } from 'src/app/np-data/lib/power-appliance.interface';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
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


@Component({
  selector: 'laiks-appliance-edit',
  templateUrl: './appliance-edit.component.html',
  styleUrls: ['./appliance-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    RouterLink,
  ]
})
export class ApplianceEditComponent implements CanComponentDeactivate {

  @Input() set appliance(value: PowerAppliance) {
    this.initialValue = value;
    this.applianceForm.reset(this.initialValue);
  }

  @Input() id: string | null = null;

  applianceForm: FormGroup<ApplianceFormType> = this.nnfb.group({
    name: [
      INITIAL_APPLIANCE.name,
      [Validators.required],
      [this.nameAsyncValidator()]
    ],
    delay: [INITIAL_APPLIANCE.delay],
    minimumDelay: [
      INITIAL_APPLIANCE.minimumDelay,
      [Validators.min(0), Validators.required],
    ],
    enabled: [INITIAL_APPLIANCE.enabled],
    color: [INITIAL_APPLIANCE.color],
    cycles: [INITIAL_APPLIANCE.cycles],
  });


  busy = signal(false);

  formStatus = toSignal(this.applianceForm.statusChanges, { initialValue: 'PENDING' });
  actionsDisabled = computed(() => this.busy() || this.formStatus() !== 'VALID');

  canDeactivate = () => this.applianceForm.pristine ? of(true) : this.confirmation.cancelEdit();


  private initialValue: PowerAppliance | null = null;

  private saveObserver: Observer<void | string> = {
    next: () => {
      this.snack.open('Izmaiņas saglabātas', 'OK', { duration: 3000 });
      this.applianceForm.reset();
      this.router.navigate(['..'], { relativeTo: this.route });
    },
    error: (err) => {
      this.snack.open(`Neizdevās saglabāt. ${err}`, 'OK');
    },
    complete: () => { this.busy.set(false); }
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appliancesService: PowerAppliancesService,
    private snack: MatSnackBar,
    private nnfb: NonNullableFormBuilder,
    private confirmation: ConfirmationDialogService,
  ) { }


  onSubmit() {
    if (!this.applianceForm.valid) {
      return;
    }

    this.busy.set(true);
    const value = this.applianceForm.getRawValue();

    if (this.id) {
      this.appliancesService.updateAppliance(this.id, value)
        .subscribe(this.saveObserver);
    } else {
      this.appliancesService.createAppliance(value)
        .subscribe(this.saveObserver);
    }

  }

  onDelete(id: string) {

    this.busy.set(true);

    this.confirmation.delete().pipe(
      mergeMap(resp => resp ? this.appliancesService.deleteAppliance(id) : EMPTY),
    ).subscribe({
      next: () => {
        this.snack.open('Izdzēsts!', 'OK', { duration: 3000 });
        this.applianceForm.reset();
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        this.snack.open(`Neizdevās izdzēst. ${err}`, 'OK');
      },
      complete: () => { this.busy.set(false); }
    });
  }


  private nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>) => {
      const value = control.value;
      if (value === this.initialValue?.name) {
        return of(null);
      }
      return this.appliancesService.getAppliancesByName(value).pipe(
        take(1),
        map(appl => appl.length > 0),
        map(res => res ? { duplicate: value } : null)
      );
    };
  }

}
