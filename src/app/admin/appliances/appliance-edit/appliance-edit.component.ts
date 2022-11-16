import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, mergeMap, Observable, of, Subscription, switchMap, take } from 'rxjs';
import { PowerAppliance, PowerConsumptionCycle } from 'src/app/np-data/lib/power-appliance.interface';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { throwIfNull } from 'src/app/shared/throw-if-null';


@Component({
  selector: 'laiks-appliance-edit',
  templateUrl: './appliance-edit.component.html',
  styleUrls: ['./appliance-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplianceEditComponent implements OnInit, OnDestroy {

  applianceForm = this.nnfb.group({
    name: [
      '',
      [Validators.required],
      [this.nameAsyncValidator()]
    ],
    delay: this.nnfb.control<'start' | 'end'>('start'),
    minimumDelay: [
      0,
      [Validators.min(0), Validators.required],
    ],
    enabled: [false],
    cycles: this.nnfb.control<PowerConsumptionCycle[]>([]),
  });


  id$: Observable<string | null> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    map(id => id === 'new' ? null : id),
  );

  appliance$: Observable<PowerAppliance | undefined> = this.id$.pipe(
    switchMap(id => id ? this.appliancesService.getAppliance(id) : of(undefined)),
  );

  private initialValue?: PowerAppliance;

  private subs?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appliancesService: PowerAppliancesService,
    private snack: MatSnackBar,
    private nnfb: NonNullableFormBuilder,
    private confirmation: ConfirmationDialogService,
  ) { }

  ngOnInit(): void {
    this.subs = this.appliance$.subscribe({
      next: ap => {
        this.initialValue = ap;
        this.applianceForm.reset(ap);
      },
      error: (err) => {
        console.log(err);
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    }
    );
  }

  ngOnDestroy(): void {
    this.subs && this.subs.unsubscribe();
  }

  onSubmit() {
    if (!this.applianceForm.valid) {
      return;
    }
    const value = this.applianceForm.getRawValue();
    this.id$.pipe(
      take(1),
      mergeMap(id => id ? this.appliancesService.updateAppliance(id, value) : this.appliancesService.createAppliance(value)),
    )
      .subscribe({
        next: () => {
          this.snack.open('Izmaiņas saglabātas', 'OK', { duration: 3000 });
          this.applianceForm.reset();
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          this.snack.open(`Neizdevās saglabāt. ${err}`, 'OK');
        },
      });
  }

  onDelete() {
    this.id$.pipe(
      take(1),
      throwIfNull(),
      mergeMap(id => this.confirmation.delete().pipe(
        mergeMap(resp => resp ? this.appliancesService.deleteAppliance(id) : EMPTY),
      ))
    ).subscribe({
      next: () => {
        this.snack.open('Izdzēsts!', 'OK', { duration: 3000 });
        this.applianceForm.reset();
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        this.snack.open(`Neizdevās izdzēst. ${err}`, 'OK');
      },
    });
  }

  canDeactivate(): Observable<boolean> {

    if (this.applianceForm.pristine) {
      return of(true);
    }

    return this.confirmation.cancelEdit();

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
