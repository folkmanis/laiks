import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../lib/users.service';

@Component({
  selector: 'laiks-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterLink]
})
export class UsersListComponent {

  dataSource$ = inject(UsersService).getUsers();

  displayedColumns = ['email'];

}
