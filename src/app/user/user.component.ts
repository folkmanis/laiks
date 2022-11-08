import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@angular/fire/auth';


@Component({
  selector: 'laiks-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {

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
