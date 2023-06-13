import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListComponent } from './users-list.component';
import { of } from 'rxjs';
import { UsersService } from '../../lib/users.service';
import { LaiksUser } from 'src/app/shared/laiks-user';

const testUser: LaiksUser = {
  email: 'user@user.com',
  npAllowed: true,
  verified: true,
  isAdmin: true,
  name: 'User User',
};

class TestUsersService {
  getUsers() {
    return of([testUser]);
  }
}

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        { provide: UsersService, useClass: TestUsersService }
      ]
    })
      .createComponent(UsersListComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
