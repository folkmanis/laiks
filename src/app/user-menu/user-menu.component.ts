import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { User } from 'firebase/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { isAdmin, isNpAllowed } from '@shared/users';
import { WithId } from '@shared/utils';
import { LaiksUser } from '../shared/users/laiks-user';

@Component({
    selector: 'laiks-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterLink]
})
export class UserMenuComponent {
  user = input<User | null>(null);

  laiksUser = input<WithId<LaiksUser> | null>(null);

  isAdmin = isAdmin();

  isNpAllowed = isNpAllowed();

  logout = output();

  onLogout() {
    this.logout.emit();
  }
}
