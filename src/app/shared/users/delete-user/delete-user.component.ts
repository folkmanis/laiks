import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../users.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LaiksUser } from '../laiks-user';
import { WithId } from '@shared/utils';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'laiks-delete-user',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteUserComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  busy = signal(false);

  @Input() id!: string;

  @Input() user?: WithId<LaiksUser>;

  onDelete() {
    this.busy.set(true);

    this.usersService
      .deleteUser(this.id)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe(() => {
        this.snack.open(`Lietotājs ${this.user?.name} izdzēsts!`, 'OK', {
          duration: 3000,
        });
        this.router.navigateByUrl('/admin/users');
      });
  }
}
