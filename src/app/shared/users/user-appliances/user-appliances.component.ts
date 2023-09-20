import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TrackByFunction,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WithId, throwIfNull } from '@shared/utils';
import { BehaviorSubject, EMPTY, finalize, switchMap } from 'rxjs';
import { UsersService } from '../users.service';
import { PowerAppliance } from '@shared/appliances';
import { LaiksUser } from '../laiks-user';

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
    RouterLink,
  ],
})
export class UserAppliancesComponent {
  private usersService = inject(UsersService);

  private id$ = new BehaviorSubject('');
  user$ = this.id$.pipe(
    switchMap((id) => (id ? this.usersService.userById(id) : EMPTY)),
    throwIfNull()
  );

  @Input() set id(value: string) {
    this.id$.next(value);
  }

  trackByFn: TrackByFunction<PowerAppliance> = (_, rec) => rec.name;

  busy = signal(false);

  onRemoveAppliance(idx: number, user: WithId<LaiksUser>) {
    this.busy.set(true);
    user.appliances.splice(idx, 1);
    this.saveUserAppliances(user);
  }

  onMoveAppliance(
    event: CdkDragDrop<PowerAppliance[]>,
    user: WithId<LaiksUser>
  ) {
    this.busy.set(true);
    moveItemInArray<PowerAppliance>(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.saveUserAppliances(user);
  }

  private saveUserAppliances(user: WithId<LaiksUser>) {
    this.usersService
      .updateUser(user.id, { appliances: user.appliances })
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe();
  }
}
