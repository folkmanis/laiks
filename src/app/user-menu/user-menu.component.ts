import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'laiks-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent {

  @Input() user: User | null = null;

  @Output() login = new EventEmitter<void>();

  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.next();
  }

  onLogin() {
    this.login.next();
  }

}
