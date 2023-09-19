import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import {
  ApplianceFormComponent,
  SystemAppliancesService,
  INITIAL_APPLIANCE,
  PowerAppliance,
  CanComponentDeactivate,
  ConfirmationDialogService,
} from '@shared';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Observable, finalize, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'laiks-edit-system-appliances',
  standalone: true,
  imports: [
    ApplianceFormComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './edit-system-appliances.component.html',
  styleUrls: ['./edit-system-appliances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSystemAppliancesComponent implements CanComponentDeactivate {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private appliancesService = inject(SystemAppliancesService);
  private confirmation = inject(ConfirmationDialogService);
  private _initialValue = INITIAL_APPLIANCE;

  @Input() id: string | null = null;

  @Input({ alias: 'appliance' })
  set initialValue(value: PowerAppliance) {
    this._initialValue = value || INITIAL_APPLIANCE;
    this.applianceForm.reset(this.initialValue);
  }
  get initialValue() {
    return this._initialValue;
  }

  busy = signal(false);

  applianceForm = new FormControl<PowerAppliance>(INITIAL_APPLIANCE, {
    nonNullable: true,
  });

  existingAppliances$ = this.appliancesService.getPowerAppliances();

  canDeactivate = () =>
    this.applianceForm.pristine || this.confirmation.cancelEdit();

  onUpdate(id: string) {
    this.appliancesService
      .updateAppliance(id, this.applianceForm.value)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe(() => {
        this.applianceForm.markAsPristine();
        this.router.navigate(['..'], { relativeTo: this.route });
      });
  }

  onCreate() {
    const appliance = { ...this.applianceForm.value, localizedNames: {} };
    this.appliancesService
      .createAppliance(appliance)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe(() => {
        this.applianceForm.markAsPristine();
        this.router.navigate(['..'], { relativeTo: this.route });
      });
  }

  onCopyFrom() {}
}
