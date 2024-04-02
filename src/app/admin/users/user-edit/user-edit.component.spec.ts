import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditComponent } from './user-edit.component';
import { UsersService } from '../../../shared/users/users.service';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { LaiksUser } from 'src/app/shared/users/laiks-user';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WithId } from '@shared/utils';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { resolveUser } from '@shared/users/resolve-user';

class TestUsersService { }

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
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        UserEditComponent,
        MatSnackBarModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        UsersService,
        provideRouter([
          {
            path: 'users/:id',
            component: UserEditComponent,
            // resolve: {
            //   user: resolveUser,
            // },
          },
        ], withComponentInputBinding()),
        ConfirmationDialogService,
        testFirebaseProvider,
      ],
    });
    await TestBed.compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('users/4ace', UserEditComponent);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('user id should be set by navigation', () => {
    expect(component.id()).toBe('4ace');
  });

});
