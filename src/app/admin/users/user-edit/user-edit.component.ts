import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
  input,
  signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { PermissionsService } from '@shared/permissions';
import { LaiksUser } from '@shared/users';
import { WithId } from '@shared/utils';

@Component({
  selector: 'laiks-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, RouterLink],
})
export class UserEditComponent {

  private permissionsService = inject(PermissionsService);

  activeUserId = input<string>();

  id = input<string>('');

  user = input<WithId<LaiksUser>>();

  isAdmin = signal(false);
  isNpBlocked = signal(false);

  adminBusy = signal(true);
  npBlockedBusy = signal(true);

  constructor() {

    this.permissionsService.isNpBlocked(this.id())
      .then(isNpBlocked => this.isNpBlocked.set(isNpBlocked))
      .finally(() => this.npBlockedBusy.set(false));

    afterNextRender(async () => {
      console.log(this.id());
      const isAdmin = await this.permissionsService.isAdmin(this.id());
      this.isAdmin.set(isAdmin);
      console.log(this.isAdmin());
      this.adminBusy.set(false);
    });
  }

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
