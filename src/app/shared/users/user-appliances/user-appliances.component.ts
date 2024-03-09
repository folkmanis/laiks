import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ColorTagComponent, PowerAppliance } from '@shared/appliances';
import { WithId, throwIfNull } from '@shared/utils';
import { finalize, switchMap } from 'rxjs';
import { LaiksUser } from '../laiks-user';
import { UsersService } from '../users.service';

@Component({
  selector: 'laiks-user-appliances',
  standalone: true,
  templateUrl: './user-appliances.component.html',
  styleUrls: ['./user-appliances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    RouterLink,
    ColorTagComponent,
  ],
})
export class UserAppliancesComponent {
  private usersService = inject(UsersService);

  id = input.required<string>();

  user$ = toObservable(this.id).pipe(
    switchMap((id) => this.usersService.userById(id)),
    throwIfNull()
  );

  trackByFn = (appliance: PowerAppliance) => appliance.name;

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
