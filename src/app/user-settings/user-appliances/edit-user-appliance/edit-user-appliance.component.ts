import { ChangeDetectionStrategy, Component, Input, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APPLIANCES_BY_NAME, ApplianceFormComponent, AppliancesByNameFn, INITIAL_APPLIANCE } from 'src/app/shared/appliance-form/appliance-form.component';
import { PowerAppliance } from 'src/app/shared/power-appliance.interface';
import { UserAppliancesService } from 'src/app/shared/user-appliances.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, filter, finalize, first, map, mergeMap, switchMap, of } from 'rxjs';
import { UserService } from 'src/app/shared/user.service';
import { throwIfNull } from 'src/app/shared/throw-if-null';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplianceType, LaiksUser } from 'src/app/shared/laiks-user';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';

const usedNames = (): AppliancesByNameFn => {
  const userAppliancesService = inject(UserAppliancesService);
  const user$ = inject(UserService).getUser().pipe(throwIfNull());
  return (name: string) => user$.pipe(
    switchMap(user => userAppliancesService.userAppliancesByName(user.uid, name)),
  );
};

@Component({
  selector: 'laiks-edit-user-appliance',
  standalone: true,
  templateUrl: './edit-user-appliance.component.html',
  styleUrls: ['./edit-user-appliance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApplianceFormComponent
  ],
  providers: [
    {
      provide: APPLIANCES_BY_NAME,
      useFactory: usedNames,
    }
  ]
})
export class EditUserApplianceComponent implements CanComponentDeactivate {

  private userService = inject(UserService);
  private userAppliancesService = inject(UserAppliancesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild(ApplianceFormComponent) private form?: ApplianceFormComponent;

  id = signal<string | null>(null);
  @Input('id') set _id(value: string | null) {
    this.id.set(value);
  }

  private user$ = this.userService.getUser().pipe(first(), throwIfNull());
  private initial$ = combineLatest({
    user: this.user$,
    id: toObservable(this.id).pipe(filter(id => !!id))
  }).pipe(
    switchMap(({ user, id }) => this.userAppliancesService.getUserAppliance(user.uid, id!))
  );

  initial = toSignal(this.initial$, { initialValue: INITIAL_APPLIANCE });

  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean> = () => {
    return !this.form || this.form?.canDeactivate();
  };

  onSave(appliance: PowerAppliance) {
    const id = this.id();
    (id ? this.updateAppliance(id, appliance) : this.insertAndActivateAppliance(appliance))
      .pipe(
        finalize(() => this.form?.busy.set(false)),
      )
      .subscribe(() => {
        this.form?.applianceForm.markAsPristine();
        this.router.navigate(['..'], { relativeTo: this.route });
      });
  }

  onDelete(id: string) {
    this.userService.laiksUser().pipe(
      first(),
      throwIfNull(),
      mergeMap(user => this.deactivateAppliance(user, id).pipe(
        mergeMap(() => this.userAppliancesService.deleteUserAppliance(user.id, id))
      )),
      finalize(() => this.form?.busy.set(false)),
    )
      .subscribe(() => {
        this.form?.applianceForm.markAsPristine();
        this.router.navigate(['..'], { relativeTo: this.route });
      });
  }

  onCancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private insertAndActivateAppliance(appliance: PowerAppliance): Observable<void> {
    return this.userService.laiksUser().pipe(
      first(),
      throwIfNull(),
      mergeMap(user => this.userAppliancesService.insertUserAppliance(user.id, appliance).pipe(
        map(id => [...user.appliances, { applianceId: id, type: ApplianceType.USER }]),
      )),
      mergeMap(appliances => this.userService.updateLaiksUser({ appliances })),
    );
  }

  private updateAppliance(id: string, appliance: PowerAppliance): Observable<void> {
    return this.userService.laiksUser().pipe(
      first(),
      throwIfNull(),
      mergeMap(user => this.userAppliancesService.updateUserAppliance(user.id, id, appliance))
    );
  }

  private deactivateAppliance(user: LaiksUser, id: string): Observable<void> {
    const update = user.appliances?.filter(rec => rec.type !== ApplianceType.USER || rec.applianceId !== id);
    if (update.length !== user.appliances.length) {
      return this.userService.updateLaiksUser({ appliances: update });
    } else {
      return of();
    }
  }
}
