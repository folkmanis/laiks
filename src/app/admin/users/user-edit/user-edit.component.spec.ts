import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditComponent } from './user-edit.component';
import { UsersService } from '../../lib/users.service';
import { provideRouter } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class TestUsersService {

}

const testUser: LaiksUser = {
  email: 'user@user.com',
  npAllowed: true,
  verified: true,
  isAdmin: true,
  name: 'User User',
};

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserEditComponent,
        MatSnackBarModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UsersService, useClass: TestUsersService },
        provideRouter([
          {
            path: 'users/:id',
            component: UserEditComponent,
          }
        ]),
        ConfirmationDialogService,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    component.user = testUser;
    component.id = '4ace';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
