import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { LocalesService } from '@shared/locales';
import { navigateRelative } from '@shared/utils/navigate-relative';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { MarketZone } from 'src/app/shared/np-data/market-zone';
import { MarketZonesService } from 'src/app/shared/np-data/market-zones.service';
import { CanComponentDeactivate } from 'src/app/shared/utils/can-deactivate.guard';
import { UpperCaseDirective } from 'src/app/shared/utils/upper-case.directive';
import { DbNameConfirmationComponent } from './db-name-confirmation/db-name-confirmation.component';

type MarketZoneGroup = FormGroup<{
  [key in keyof MarketZone]: FormControl<MarketZone[key]>;
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
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink,
    MatDividerModule,
    UpperCaseDirective,
    MatCheckboxModule,
    MatDialogModule,
  ],
})
export class MarketZoneEditComponent implements CanComponentDeactivate {
  private marketZoneService = inject(MarketZonesService);
  private confirmation = inject(ConfirmationDialogService);
  private navigate = navigateRelative();

  form: MarketZoneGroup = inject(FormBuilder).nonNullable.group({
    description: ['', Validators.required],
    locale: ['', Validators.required],
    url: ['', Validators.required],
    tax: [0, Validators.required],
    dbName: ['', Validators.required],
    enabled: [false],
  });

  id = model<string>();

  initialValue = input<MarketZone>();

  locales = toSignal(inject(LocalesService).getLocalesFlow(), { initialValue: [] });

  busy = signal(false);

  constructor() {
    effect(() => {
      this.form.reset(this.initialValue());
    }, { allowSignalWrites: true });
  }

  canDeactivate = () =>
    this.form.pristine || this.confirmation.cancelEdit();

  async onSave() {

    const id = this.id();
    if (!id || this.form.valid == false) {
      return;
    }

    if (this.initialValue()) {
      const confirmation = await this.confirmDbNameChange();
      if (!confirmation) {
        return;
      }
      this.busy.set(true);
      await this.marketZoneService.updateZone(id, this.form.value);
    } else {
      this.busy.set(true);
      await this.marketZoneService
        .setZone(id, this.form.getRawValue());
    }

    this.busy.set(false);
    this.form.markAsPristine();
    this.navigate(['..']);

  }

  private async confirmDbNameChange(): Promise<boolean> {
    const newDbName = this.form.getRawValue().dbName;
    const initialValue = this.initialValue();
    if (initialValue && newDbName !== initialValue.dbName) {
      return this.confirmation.openComponent(DbNameConfirmationComponent);
    } else {
      return true;
    }
  }
}
