import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  effect,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import {
  PresetPowerAppliance,
  SystemAppliancesService,
} from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { Locale } from '@shared/locales';
import { CanComponentDeactivate, WithId } from '@shared/utils';
import { navigateRelative } from '@shared/utils/navigate-relative';

type NamesForm = { [key: string]: FormControl<string>; };

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
  host: {
    'class': 'vertical-container'
  },
})
export class LocalizedNamesComponent implements CanComponentDeactivate {

  private navigate = navigateRelative();
  private confirmation = inject(ConfirmationDialogService);
  private appliancesService = inject(SystemAppliancesService);
  private snack = inject(MatSnackBar);
  private errorMessageTemplate = viewChild.required<TemplateRef<unknown>>('errorMessageTemplate');

  namesForm = new FormGroup<NamesForm>({});

  dataSource = signal<LocaleRowData[]>([]);

  busy = signal(false);

  displayColumns = ['name', 'input'];

  id = input.required<string>();

  appliance = input<PresetPowerAppliance>();

  locales = input<WithId<Locale>[]>([]);

  constructor() {
    effect(() => {
      this.initializeControls(this.appliance(), this.locales());
    }, { allowSignalWrites: true });
  }

  canDeactivate = () =>
    this.namesForm.pristine || this.confirmation.cancelEdit();

  async onSave() {
    if (this.namesForm.valid == false || this.namesForm.value == null) {
      return;
    }

    this.busy.set(true);
    const localizedNames = this.namesForm
      .value as PresetPowerAppliance['localizedNames'];

    try {
      await this.appliancesService
        .updateAppliance(this.id(), { localizedNames });
      this.namesForm.markAsPristine();
      this.navigate(['../..']);
    } catch (error) {
      this.snack.openFromTemplate(this.errorMessageTemplate(), { duration: 5000 });
    }
    this.busy.set(false);
  }

  private initializeControls(
    appliance: PresetPowerAppliance | undefined,
    locales: WithId<Locale>[]
  ) {
    const keys = locales.map((l) => l.id);
    const localizedNames = appliance?.localizedNames || {};
    const initialValue = keys.reduce(
      (acc, curr) => ({ ...acc, [curr]: localizedNames[curr] || '' }),
      {}
    );

    for (const key of Object.keys(this.namesForm.controls)) {
      if (locales.some((locale) => locale.id === key) == false) {
        (this.namesForm as FormGroup).removeControl(key, {});
      }
    }
    for (const locale of locales) {
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
        locale: locales.find((l) => l.id === key)!,
      })
    );
    this.dataSource.set(data);
  }
}
