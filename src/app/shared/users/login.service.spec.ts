import { TestBed } from '@angular/core/testing';
import { provideTestFirebase } from '@shared/firebase/test-firebase-provider';
import {
  loginAdmin,
  logout,
} from '@shared/firebase/test-firebase-provider.spec';
import { PermissionsService } from '@shared/permissions';
import { firstValueFrom } from 'rxjs';
import { defaultUser } from './laiks-user';
import { LoginService } from './login.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

const NEW_USER = {
  email: 'user2@example.com',
  password: '2393fgklsd@43KL',
  name: 'Example User',
};

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTestFirebase(),
        PermissionsService,
        provideExperimentalZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in with email', async () => {
    await loginAdmin();

    await expectAsync(firstValueFrom(service.laiksUser$))
      .toBeResolvedTo(jasmine.truthy())
      .then(() => logout());
  });

  it('should create and delete email user', async () => {
    const { email, password, name } = NEW_USER;
    const defaultLaiksUser = defaultUser(email, name);

    const laiksUser = await service.createEmailAccount(email, password, name);
    expect(laiksUser)
      .withContext('user created')
      .toEqual(jasmine.objectContaining(defaultLaiksUser));

    await service.loginWithEmail(email, password);

    await service.deleteLaiksUser(laiksUser.id);
    await service.deleteAccount();

    const isLogin = await firstValueFrom(service.login$);
    expect(isLogin).toBeFalse();
  });
});
