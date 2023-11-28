import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditComponent } from './user-edit.component';
import { UsersService } from '../../../shared/users/users.service';
import { provideRouter } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { LaiksUser } from 'src/app/shared/users/laiks-user';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WithId } from '@shared/utils';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';

class TestUsersService {}

const testUser: WithId<LaiksUser> = {
  id: '4ace',
  email: 'user@user.com',
  verified: true,
  name: 'User User',
  includeVat: true,
  vatAmount: 0.21,
  appliances: [],
  marketZoneId: 'LV',
  locale: 'lv',
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
          },
        ]),
        ConfirmationDialogService,
        testFirebaseProvider,
      ],
    }).compileComponents();

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
