import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, mergeMap, Observer, of, take } from 'rxjs';
import { PowerAppliance, PowerConsumptionCycle } from 'src/app/np-data/lib/power-appliance.interface';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';


@Component({
  selector: 'laiks-appliance-edit',
  templateUrl: './appliance-edit.component.html',
  styleUrls: ['./appliance-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplianceEditComponent implements OnInit {

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

  id: string | null = null;

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
    complete: () => { }
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appliancesService: PowerAppliancesService,
    private snack: MatSnackBar,
    private nnfb: NonNullableFormBuilder,
    private confirmation: ConfirmationDialogService,
  ) { }

  ngOnInit(): void {

    this.initialValue = this.route.snapshot.data['appliance'];

    if (this.initialValue) {
      this.id = this.route.snapshot.paramMap.get('id') as string;
      this.applianceForm.reset(this.initialValue);
    }

  }


  onSubmit() {
    if (!this.applianceForm.valid) {
      return;
    }
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
