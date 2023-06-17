import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from 'src/app/shared/user.service';
import { ApplianceRecord, ApplianceType } from 'src/app/shared/laiks-user';
import { PowerAppliancesService } from 'src/app/shared/power-appliances.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, MonoTypeOperatorFunction, Observable, combineLatest, finalize, first, forkJoin, map, mergeMap, pipe, shareReplay, switchMap } from 'rxjs';
import { PowerAppliance } from 'src/app/shared/power-appliance.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WithId } from 'src/app/shared/with-id';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddApplianceDialogComponent } from './add-appliance-dialog/add-appliance-dialog.component';
import { ApplianceDialogData, ApplianceResponse } from './add-appliance-dialog/appliance-dialog-data.interface';

type ApplianceRecordWithData = ApplianceRecord & {
  data: PowerAppliance;
};

const filterType = (type: ApplianceType): MonoTypeOperatorFunction<ApplianceRecord[]> =>
  pipe(map(appliances => appliances.filter(appl => appl.type === type)));

@Component({
  selector: 'laiks-user-appliances',
  standalone: true,
  templateUrl: './user-appliances.component.html',
  styleUrls: ['./user-appliances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
})
export class UserAppliancesComponent {


  private userService = inject(UserService);
  private appliancesService = inject(PowerAppliancesService);
  private dialog = inject(MatDialog);

  activeAppliances$ = this.userService.laiksUser().pipe(
    map(user => user?.appliances || []),
    shareReplay(1),
  );

  activeAppliancesWithData$ = this.activeAppliances$.pipe(
    map(rec => this.getAppliancesObservers(rec)),
    switchMap(obs => forkJoin(obs)),
  );

  busy = signal(false);

  onAppendAppliance(existingAppliances: ApplianceRecord[]) {

    this.busy.set(true);

    forkJoin({
      system: this.appliancesOfType(ApplianceType.SYSTEM),
      user: this.appliancesOfType(ApplianceType.USER,)
    }).pipe(
      mergeMap((data: ApplianceDialogData) => this.dialog.open(AddApplianceDialogComponent, { data }).afterClosed()),
      mergeMap(resp => this.appendAppliance(resp, existingAppliances)),
      finalize(() => this.busy.set(false)),
    ).subscribe(resp => console.log(resp));

  }

  private appendAppliance(resp: ApplianceResponse | null, existingAppliances: ApplianceRecord[]): Observable<void> {
    if (!resp) {
      return EMPTY;
    }

    const update = [...existingAppliances];

    if (resp.type === 'system') {
      update.push({
        type: ApplianceType.SYSTEM,
        applianceId: resp.applianceId
      });
    }
    if (resp.type === 'user') {
      update.push({
        type: ApplianceType.USER,
        applianceId: resp.applianceId,
      });
    }

    return this.userService.updateLaiksUser({ appliances: update });


  }

  private getAppliance(record: ApplianceRecord): Observable<PowerAppliance> {
    if (record.type === ApplianceType.SYSTEM) {
      return this.appliancesService.getAppliance(record.applianceId);
    }
    if (record.type === ApplianceType.USER) {
      return this.userService.getUserAppliance(record.applianceId);
    }
    return EMPTY;
  }

  private getApplianceRecordWithData(record: ApplianceRecord): Observable<ApplianceRecordWithData> {
    return this.getAppliance(record).pipe(
      map(data => ({ ...record, data }))
    );
  }

  private getAppliancesObservers(records: ApplianceRecord[]): Observable<ApplianceRecordWithData>[] {
    return records.map(rec => this.getApplianceRecordWithData(rec));
  }

  private appliancesOfType(type: ApplianceType): Observable<WithId<PowerAppliance>[]> {
    let appliances$: Observable<WithId<PowerAppliance>[]> = EMPTY;
    if (type === ApplianceType.SYSTEM) {
      appliances$ = this.appliancesService.getPowerAppliances({ enabledOnly: true });
    }
    if (type === ApplianceType.USER) {
      appliances$ = this.userService.userAppliances();
    }
    return combineLatest({
      usedAppliances: this.activeAppliances$.pipe(
        filterType(type),
        map(appliances => appliances.map(appl => appl.applianceId)),
      ),
      appliances: appliances$,
    }).pipe(
      map(({ usedAppliances, appliances }) => appliances.filter(ap => !usedAppliances.includes(ap.id))),
      first(),
    );
  }


}
