import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { WithId } from '@shared/utils';
import { LaiksUser } from '../shared/users/laiks-user';

@Component({
  selector: 'laiks-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterLink],
})
export class UserMenuComponent {
  @Input() user?: User | null = null;

  @Input() laiksUser: WithId<LaiksUser> | null = null;

  @Input({ transform: booleanAttribute }) isAdmin: boolean = false;

  @Input({ transform: booleanAttribute }) isNpAllowed: boolean = false;

  @Output() logout = new EventEmitter<void>();
}
