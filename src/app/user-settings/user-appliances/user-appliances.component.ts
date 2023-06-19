import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, TrackByFunction } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { pick } from 'lodash-es';
import { EMPTY, Observable, finalize, first, mergeMap, switchMap } from 'rxjs';
import { ApplianceRecord, ApplianceType } from 'src/app/shared/laiks-user';
import { throwIfNull } from 'src/app/shared/throw-if-null';
import {
  ApplianceRecordWithData,
  UserAppliancesService
} from 'src/app/shared/user-appliances.service';
import { UserService } from 'src/app/shared/user.service';
import { AddApplianceDialogComponent } from './add-appliance-dialog/add-appliance-dialog.component';
import { ApplianceDialogData, ApplianceResponse } from './add-appliance-dialog/appliance-dialog-data.interface';
import { CdkDrag, CdkDragHandle, CdkDropList, DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


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
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
})
export class UserAppliancesComponent {

  private userAppliancesService = inject(UserAppliancesService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  trackByFn: TrackByFunction<ApplianceRecordWithData> = (_, rec) => rec.type + rec.applianceId;

  activeAppliancesWithData$ = this.userService.laiksUser().pipe(
    throwIfNull(),
    switchMap(user =>
      this.userAppliancesService.getActiveAppliancesWithData(user.id, user.appliances || [])
    ),
  );

  busy = signal(false);

  onAppendAppliance(existingAppliances: ApplianceRecordWithData[]) {

    this.busy.set(true);
    this.userService.laiksUser().pipe(
      throwIfNull(),
      first(),
      mergeMap(user => this.userAppliancesService.getUnusedAppliances(user.id, existingAppliances)),
      mergeMap((data: ApplianceDialogData) => this.dialog.open(AddApplianceDialogComponent, { data }).afterClosed()),
      mergeMap(resp => this.appendAppliance(resp, existingAppliances)),
      finalize(() => this.busy.set(false)),
    ).subscribe();

  }

  onRemoveAppliance(idx: number, existingAppliances: ApplianceRecordWithData[]) {
    this.busy.set(true);
    const update = existingAppliances
      .map(data => pick(data, 'type', 'applianceId'))
      .filter((_, i) => i !== idx);

    this.userService.updateLaiksUser({ appliances: update }).pipe(
      finalize(() => this.busy.set(false)),
    ).subscribe();
  }

  onMoveAppliance(event: CdkDragDrop<ApplianceRecordWithData[]>) {
    this.busy.set(true);
    moveItemInArray<ApplianceRecordWithData>(event.container.data, event.previousIndex, event.currentIndex);
    const update = event.container.data
      .map(data => pick(data, 'type', 'applianceId'));
    this.userService.updateLaiksUser({ appliances: update }).pipe(
      finalize(() => this.busy.set(false)),
    ).subscribe();
  }

  private appendAppliance(
    resp: ApplianceResponse | null,
    existingAppliances: ApplianceRecordWithData[]
  ): Observable<void> {
    if (!resp) {
      return EMPTY;
    }

    const update: ApplianceRecord[] =
      existingAppliances.map(data => pick(data, 'type', 'applianceId'));

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

}
