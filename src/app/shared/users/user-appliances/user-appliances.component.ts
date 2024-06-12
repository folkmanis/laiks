import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import {
  ApplianceDeletedSnackComponent,
  ColorTagComponent,
  PowerAppliance,
} from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { WithId, throwIfNull } from '@shared/utils';
import { switchMap } from 'rxjs';
import { LaiksUser } from '../laiks-user';
import { UsersService } from '../users.service';

@Component({
  selector: 'laiks-user-appliances',
  standalone: true,
  templateUrl: './user-appliances.component.html',
  styleUrls: ['./user-appliances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    RouterLink,
    ColorTagComponent,
  ],
  host: {
    class: 'vertical-container',
  },
})
export class UserAppliancesComponent {
  private usersService = inject(UsersService);
  private confirmation = inject(ConfirmationDialogService);
  private snack = inject(MatSnackBar);

  id = input.required<string>();

  user$ = toObservable(this.id).pipe(
    switchMap((id) => this.usersService.userByIdFlow(id)),
    throwIfNull(),
  );

  user = toSignal(this.user$);

  trackByFn = (appliance: PowerAppliance) => appliance.name;

  busy = signal(false);

  async onRemoveAppliance(idx: number, user: WithId<LaiksUser>) {
    if (await this.confirmation.delete()) {
      const name = user.appliances[idx].name;
      user.appliances.splice(idx, 1);
      await this.saveUserAppliances(user);
      this.snack.openFromComponent(ApplianceDeletedSnackComponent, {
        data: name,
      });
    }
  }

  onMoveAppliance(
    event: CdkDragDrop<PowerAppliance[]>,
    user: WithId<LaiksUser>,
  ) {
    moveItemInArray<PowerAppliance>(
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    this.saveUserAppliances(user);
  }

  private async saveUserAppliances(user: WithId<LaiksUser>) {
    this.busy.set(true);
    await this.usersService.updateUser(user.id, {
      appliances: user.appliances,
    });
    this.busy.set(false);
  }
}
