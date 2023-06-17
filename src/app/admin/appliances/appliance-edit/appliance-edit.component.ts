import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observer, mergeMap, of } from 'rxjs';
import { PowerAppliance } from 'src/app/shared/power-appliance.interface';
import { PowerAppliancesService } from 'src/app/shared/power-appliances.service';
import { APPLIANCES_BY_NAME, ApplianceFormComponent } from 'src/app/shared/appliance-form/appliance-form.component';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';


@Component({
  selector: 'laiks-appliance-edit',
  templateUrl: './appliance-edit.component.html',
  styleUrls: ['./appliance-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ApplianceFormComponent,
    NgIf,
  ],
  providers: [
    {
      provide: APPLIANCES_BY_NAME,
      useFactory: () => {
        const appliancesService = inject(PowerAppliancesService);
        return (value: string) => appliancesService.getAppliancesByName(value);
      }
    }
  ]
})
export class ApplianceEditComponent implements CanComponentDeactivate {

  @ViewChild(ApplianceFormComponent)
  private formComponent?: ApplianceFormComponent;

  @Input('appliance') initialValue: PowerAppliance | null = null;

  @Input() id: string | null = null;

  canDeactivate = () =>
    !this.formComponent || this.formComponent.canDeactivate();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appliancesService: PowerAppliancesService,
    private snack: MatSnackBar,
  ) { }


  onSave(value: PowerAppliance) {

    of(this.id).pipe(
      mergeMap(id => id ? this.appliancesService.updateAppliance(id, value) : this.appliancesService.createAppliance(value)),
    ).subscribe({
      next: () => {
        this.snack.open('Izmaiņas saglabātas', 'OK', { duration: 3000 });
        this.formComponent?.applianceForm.reset();
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        this.snack.open(`Neizdevās saglabāt. ${err}`, 'OK');
      },
      complete: () => { this.formComponent?.busy.set(false); }
    });

  }

  onDelete(id: string) {
    this.appliancesService.deleteAppliance(id).subscribe({
      next: () => {
        this.snack.open('Izdzēsts!', 'OK', { duration: 3000 });
        this.formComponent?.applianceForm.reset();
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        this.snack.open(`Neizdevās izdzēst. ${err}`, 'OK');
      },
      complete: () => { this.formComponent?.busy.set(false); }
    });
  }

  onCancel() {
    console.log('cancel');
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
