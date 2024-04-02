import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { PermissionsService } from '@shared/permissions';
import { defaultUser } from './laiks-user';
import { first, firstValueFrom, mergeMap, tap } from 'rxjs';

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

  it('should create and delete email user', async () => {

    const { email, password, name } = NEW_USER;
    const defaultLaiksUser = defaultUser(email, name);

    const laiksUser = await service.createEmailAccount(email, password, name);
    expect(laiksUser)
      .withContext('user created')
      .toEqual(defaultLaiksUser);

    await service.deleteAccount();

    const isLogin = await firstValueFrom(service.loginObserver());
    expect(isLogin).toBeFalse();

  });
});
