import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { PermissionsService } from '@shared/permissions';
import { LaiksUser } from '@shared/users';
import { WithId } from '@shared/utils';
import { filter, finalize, map, switchMap, tap } from 'rxjs';

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

  id = signal('');
  @Input('id') set idSet(value: string) {
    this.id.set(value);
  }

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

  onSetAdmin(value: boolean) {
    this.adminBusy.set(true);
    this.permissionsService
      .setAdmin(this.id(), value)
      .pipe(finalize(() => this.adminBusy.set(false)))
      .subscribe();
  }

  onSetNpBlocked(value: boolean) {
    this.npBlockedBusy.set(true);
    this.permissionsService
      .setNpBlocked(this.id(), value)
      .pipe(finalize(() => this.npBlockedBusy.set(false)))
      .subscribe();
  }
}
