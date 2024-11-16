import { TestBed } from '@angular/core/testing';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideTestFirebase } from '@shared/firebase/test-firebase-provider';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog';
import { UsersService } from '../../../shared/users/users.service';
import { UserEditComponent } from './user-edit.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

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
        provideRouter(
          [
            {
              path: 'users/:id',
              component: UserEditComponent,
              // resolve: {
              //   user: resolveUser,
              // },
            },
          ],
          withComponentInputBinding(),
        ),
        ConfirmationDialogService,
        provideTestFirebase(),
        provideExperimentalZonelessChangeDetection(),
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
