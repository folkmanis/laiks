import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UsersService } from '../../lib/users.service';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { WithId } from 'src/app/shared/with-id';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'laiks-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatTableModule, MatButtonModule, RouterLink]
})
export class UsersListComponent implements OnInit {

  dataSource$: Observable<WithId<LaiksUser>[]> = this.usersService.getUsers();

  displayedColumns = ['email'];

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
  }

}
