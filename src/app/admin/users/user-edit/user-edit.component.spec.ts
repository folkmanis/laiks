import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditComponent } from './user-edit.component';
import { UsersAdminService } from '../../lib/users-admin.service';
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
  verified: true,
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
        { provide: UsersAdminService, useClass: TestUsersService },
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
    component.id.set('4ace');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
