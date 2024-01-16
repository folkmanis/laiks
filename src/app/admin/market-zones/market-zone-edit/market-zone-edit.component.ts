import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
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
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, Observable, finalize, mergeMap, of } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { LocalesService } from '@shared/locales';
import { MarketZone } from 'src/app/shared/np-data/market-zone';
import { MarketZonesService } from 'src/app/shared/np-data/market-zones.service';
import { CanComponentDeactivate } from 'src/app/shared/utils/can-deactivate.guard';
import { UpperCaseDirective } from 'src/app/shared/utils/upper-case.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private marketZoneService = inject(MarketZonesService);
  private confirmation = inject(ConfirmationDialogService);
  private dialog = inject(MatDialog);

  form: MarketZoneGroup = inject(FormBuilder).nonNullable.group({
    description: ['', Validators.required],
    locale: ['', Validators.required],
    url: ['', Validators.required],
    tax: [0, Validators.required],
    dbName: ['', Validators.required],
    enabled: [false],
  });

  idControl = new FormControl<string>('', {
    validators: [Validators.required],
    nonNullable: true,
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

  canDeactivate = () =>
    this.form.pristine ? of(true) : this.confirmation.cancelEdit();

  onSave() {
    this.busy.set(true);
    const id = this.id;
    if (id) {
      this.checkDbNameChange()
        .pipe(
          mergeMap((confirmation) =>
            confirmation
              ? this.marketZoneService.updateZone(id, this.form.value)
              : EMPTY
          ),
          finalize(() => {
            this.busy.set(false);
          })
        )
        .subscribe(() => this.returnToList());
    } else {
      this.marketZoneService
        .setZone(this.idControl.value, this.form.getRawValue())
        .pipe(
          finalize(() => {
            this.busy.set(false);
          })
        )
        .subscribe(() => this.returnToList());
    }
  }

  isInvalid(): boolean {
    return !this.form.valid || !(this.id || this.idControl.valid);
  }

  private returnToList() {
    this.form.markAsPristine();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private checkDbNameChange(): Observable<boolean> {
    const newDbName = this.form.getRawValue().dbName;
    if (!!this.id && newDbName !== this.initialValue?.dbName) {
      return this.dialog.open(DbNameConfirmationComponent).afterClosed();
    } else {
      return of(true);
    }
  }
}
