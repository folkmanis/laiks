import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { PermissionsService } from '@shared/permissions';
import { defaultUser } from './laiks-user';
import { first, mergeMap, tap } from 'rxjs';

const NEW_USER = {
  email: 'user2@example.com',
  password: '2393fgklsd@43KL',
  name: 'Example User',
};

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [testFirebaseProvider, PermissionsService],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create and delete email user', (done: DoneFn) => {
    const { email, password, name } = NEW_USER;
    const defaultLaiksUser = defaultUser(email, name);

    service
      .createEmailAccount(email, password, name)
      .pipe(
        tap((laiksUser) =>
          expect(laiksUser)
            .withContext('user created')
            .toEqual(defaultLaiksUser)
        ),
        mergeMap(() => service.deleteAccount()),
        mergeMap(() => service.loginObserver()),
        first()
      )
      .subscribe({
        next: (laiksUser) => {
          expect(laiksUser).toBeFalse();
          done();
        },
        error: (err) => done.fail(err),
      });
  });
});
