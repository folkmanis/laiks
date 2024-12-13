import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
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
    imports: [MatCheckboxModule, MatButtonModule, RouterLink],
    host: {
        class: 'vertical-container',
    }
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
    effect(async () => {
      this.getAdmin(this.id());
      this.getNpBlocked(this.id());
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

  private async getAdmin(id: string) {
    const isAdmin = await this.permissionsService.isAdmin(id);
    this.isAdmin.set(isAdmin);
    this.adminBusy.set(false);
  }

  private async getNpBlocked(id: string) {
    const isNpBlocked = await this.permissionsService.isNpBlocked(id);
    this.isNpBlocked.set(isNpBlocked);
    this.npBlockedBusy.set(false);
  }
}
