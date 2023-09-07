import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { MarketZone } from 'src/app/shared/market-zone';
import { MarketZonesService } from 'src/app/shared/market-zones.service';
import { LocalesService } from 'src/app/shared/locales.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { isEqual, pickBy } from 'lodash-es';
import { MatDividerModule } from '@angular/material/divider';
import { UpperCaseDirective } from 'src/app/shared/upper-case.directive';

type MarketZoneGroup = FormGroup<{
  [key in keyof MarketZone]: FormControl<MarketZone[key]>
}>;

@Component({
  selector: 'laiks-market-zone-edit',
  standalone: true,
  templateUrl: './market-zone-edit.component.html',
  styleUrls: ['./market-zone-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink,
    MatDividerModule,
    UpperCaseDirective,
  ],
})
export class MarketZoneEditComponent implements CanComponentDeactivate {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private marketZoneService = inject(MarketZonesService);
  private confirmation = inject(ConfirmationDialogService);

  form: MarketZoneGroup = inject(FormBuilder).nonNullable.group({
    description: ['', Validators.required],
    locale: ['', Validators.required],
    url: ['', Validators.required],
    tax: [0, Validators.required],
    dbName: ['', Validators.required],
  });

  idControl = new FormControl<string>('', {
    validators: [Validators.required],
    nonNullable: true
  });

  @Input() id?: string;

  private _initialValue?: MarketZone;
  @Input() set initialValue(value: MarketZone | undefined) {
    this.form.reset(value, { emitEvent: false });
    this._initialValue = value;
  }
  get initialValue() {
    return this._initialValue;
  }

  locales = toSignal(inject(LocalesService).getLocales(), { initialValue: [] });

  busy = signal(false);

  canDeactivate = () => this.form.pristine ? of(true) : this.confirmation.cancelEdit();

  onSave() {
    this.busy.set(true);
    if (this.id) {
      this.marketZoneService.updateZone(this.id, this.form.value)
        .subscribe(() => this.returnToList());
    } else {
      this.marketZoneService.setZone(this.idControl.value, this.form.getRawValue())
        .subscribe(() => this.returnToList());
    }
  }

  isInvalid(): boolean {
    return !this.form.valid || !(this.id || this.idControl.valid);
  }

  private returnToList() {
    this.busy.set(false);
    this.form.markAsPristine();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
