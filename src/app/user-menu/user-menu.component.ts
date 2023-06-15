import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@angular/fire/auth';
import { LaiksUser } from '../shared/laiks-user';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'laiks-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, MatButtonModule, MatMenuModule, MatIconModule, RouterLink]
})
export class UserMenuComponent {

  @Input() user: User | null = null;

  @Input() laiksUser: LaiksUser | null = null;

  @Input() isAdmin: boolean | null = false;

  @Input() npAllowed: boolean | null = false;

  @Output() login = new EventEmitter<void>();

  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.next();
  }

  onLogin() {
    this.login.next();
  }

}
