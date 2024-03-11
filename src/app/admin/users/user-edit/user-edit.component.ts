import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { PermissionsService } from '@shared/permissions';
import { LaiksUser } from '@shared/users';
import { WithId } from '@shared/utils';
import { filter, finalize, switchMap, tap } from 'rxjs';

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

  @Input() activeUserId: string | undefined;

  id = input('');

  @Input() user?: WithId<LaiksUser>;

  adminBusy = signal(false);
  npBlockedBusy = signal(false);

  admin$ = toObservable(this.id).pipe(
    tap(() => this.adminBusy.set(true)),
    filter((id) => typeof id === 'string'),
    switchMap((id) => this.permissionsService.isAdmin(id)),
    tap(() => this.adminBusy.set(false))
  );

  npBlocked$ = toObservable(this.id).pipe(
    tap(() => this.npBlockedBusy.set(true)),
    filter((id) => typeof id === 'string'),
    switchMap((id) => this.permissionsService.isNpBlocked(id)),
    tap(() => this.npBlockedBusy.set(false))
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
