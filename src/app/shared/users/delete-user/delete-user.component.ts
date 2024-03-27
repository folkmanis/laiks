import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { WithId } from '@shared/utils';
import { LaiksUser } from '../laiks-user';
import { UsersService } from '../users.service';
import { DeletedUserSnackComponent } from './deleted-user-snack/deleted-user-snack.component';

@Component({
  selector: 'laiks-delete-user',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'vertical-container'
  },
})
export class DeleteUserComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  busy = signal(false);

  id = input.required<string>();

  user = input.required<WithId<LaiksUser>>();

  name = computed(() => this.user().name);

  async onDelete() {
    this.busy.set(true);

    await this.usersService.deleteUser(this.id());

    this.busy.set(false);
    this.snack.openFromComponent(DeletedUserSnackComponent, { data: this.name() });
    this.router.navigateByUrl('/admin/users');

  }
}
