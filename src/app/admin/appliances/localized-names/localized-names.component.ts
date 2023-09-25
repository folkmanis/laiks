import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  PresetPowerAppliance,
  SystemAppliancesService,
} from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { Locale } from '@shared/locales';
import { CanComponentDeactivate, WithId } from '@shared/utils';
import { finalize } from 'rxjs';

type NamesForm = { [key: string]: FormControl<string> };

interface LocaleRowData {
  locale: Locale;
  control: FormControl<string>;
}

@Component({
  selector: 'laiks-localized-names',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './localized-names.component.html',
  styleUrls: ['./localized-names.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalizedNamesComponent
  implements OnChanges, CanComponentDeactivate
{
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private confirmation = inject(ConfirmationDialogService);
  private readonly appliancesService = inject(SystemAppliancesService);

  private _locales: WithId<Locale>[] = [];

  namesForm = new FormGroup<NamesForm>({});

  dataSource = signal<LocaleRowData[]>([]);

  busy = signal(false);

  displayColumns = ['name', 'input'];

  @Input() id!: string;
  @Input() appliance?: PresetPowerAppliance;

  @Input() set locales(value: WithId<Locale>[]) {
    this._locales = Array.isArray(value) ? value : [];
  }
  get locales() {
    return this._locales;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { appliance, locales } = changes;
    if (
      appliance.previousValue !== appliance.currentValue ||
      locales.previousValue !== locales.currentValue
    )
      this.initializeControls();
  }

  canDeactivate = () =>
    this.namesForm.pristine || this.confirmation.cancelEdit();

  onSave() {
    if (this.namesForm.valid == false || this.namesForm.value == null) {
      return;
    }

    this.busy.set(true);
    const localizedNames = this.namesForm
      .value as PresetPowerAppliance['localizedNames'];
    this.appliancesService
      .updateAppliance(this.id, { localizedNames })
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe(() => {
        this.namesForm.markAsPristine();
        this.router.navigate(['../..'], { relativeTo: this.route });
      });
  }

  private initializeControls() {
    const keys = this.locales.map((l) => l.id);
    const localizedNames = this.appliance?.localizedNames || {};
    const initialValue = keys.reduce(
      (acc, curr) => ({ ...acc, [curr]: localizedNames[curr] || '' }),
      {}
    );

    for (const key of Object.keys(this.namesForm.controls)) {
      if (this.locales.some((locale) => locale.id === key) == false) {
        (this.namesForm as FormGroup).removeControl(key, {});
      }
    }
    for (const locale of this.locales) {
      if (this.namesForm.contains(locale.id) == false) {
        this.namesForm.addControl(
          locale.id,
          new FormControl<string>('', { nonNullable: true })
        );
      }
    }
    this.namesForm.reset(initialValue);

    const data = Object.entries(this.namesForm.controls).map(
      ([key, control]) => ({
        control,
        locale: this.locales.find((l) => l.id === key)!,
      })
    );
    this.dataSource.set(data);
  }
}
