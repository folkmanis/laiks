import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UsersService } from '../../lib/users.service';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { WithId } from 'src/app/shared/with-id';
import { Observable } from 'rxjs';

@Component({
  selector: 'laiks-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
