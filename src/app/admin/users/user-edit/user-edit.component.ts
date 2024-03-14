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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { PermissionsService } from '@shared/permissions';
import { LaiksUser } from '@shared/users';
import { WithId } from '@shared/utils';
import { switchMap } from 'rxjs';

@Component({
  selector: 'laiks-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, RouterLink, AsyncPipe],
})
export class UserEditComponent {
  private permissionsService = inject(PermissionsService);

  activeUserId = input<string>();

  id = input('');

  user = input<WithId<LaiksUser>>();

  adminBusy = signal(false);
  npBlockedBusy = signal(false);

  admin$ = toObservable(this.id).pipe(
    switchMap((id) => this.permissionsService.isAdmin(id)),
  );

  npBlocked$ = toObservable(this.id).pipe(
    switchMap((id) => this.permissionsService.isNpBlocked(id)),
  );

  async onSetAdmin(value: boolean) {
    this.adminBusy.set(true);
    await this.permissionsService.setAdmin(this.id(), value);
    this.adminBusy.set(false);
  }

  async onSetNpBlocked(value: boolean) {
    this.npBlockedBusy.set(true);
    await this.permissionsService.setNpBlocked(this.id(), value);
    this.npBlockedBusy.set(false);
  }
}
