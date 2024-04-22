import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LaiksUser, LoginService } from '@shared/users';
import { RouterTestingHarness } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { MatInputHarness } from "@angular/material/input/testing";
import { MatFormFieldHarness } from "@angular/material/form-field/testing";
import { MatButtonHarness } from "@angular/material/button/testing";
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

const EMAIL_USER = {
  email: 'user@example.com',
  password: 'password',
};

@Component({
  template: `root-component`,
  standalone: true,
})
class TestRootComponent { }

@Component({
  template: `redirected-component`,
  standalone: true,
})
class TestRedirectComponent { }


describe('LoginComponent', () => {
  let component: LoginComponent;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let harness: RouterTestingHarness;

  let loader: HarnessLoader;

  let emailField: MatFormFieldHarness;
  let passwordField: MatFormFieldHarness;
  let submitButton: MatButtonHarness;
  let registerButton: MatButtonHarness;
  let gmailButton: MatButtonHarness;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj<LoginService>('LoginService', ['loginWithEmail', 'loginWithGmail', 'logout']);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        provideRouter([
          { path: 'login', component: LoginComponent },
          { path: 'redirected', component: TestRedirectComponent },
          { path: '', component: TestRootComponent },
        ], withComponentInputBinding()),
      ],
    });
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('login', LoginComponent);

    loader = TestbedHarnessEnvironment.loader(harness.fixture);
    emailField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#email' }));
    passwordField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#password' }));
    submitButton = await loader.getHarness(MatButtonHarness.with({ selector: '#submit-button' }));
    registerButton = await loader.getHarness(MatButtonHarness.with({ selector: '#register-button' }));
    gmailButton = await loader.getHarness(MatButtonHarness.with({ selector: '#gmail-button' }));

    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create input fields and buttons', async () => {
    expect(emailField).withContext('email').toBeTruthy();
    expect(passwordField).withContext('password').toBeTruthy();
    expect(submitButton).withContext('submit').toBeTruthy();
    expect(registerButton).withContext('register').toBeTruthy();
    expect(gmailButton).withContext('gmail').toBeTruthy();
  });

  it('should recieve redirect input', async () => {
    component = await harness.navigateByUrl('login?redirect=redirected', LoginComponent);
    expect(component.redirect()).toBe('redirected');
  });

  it('should submit button be initially disabled', async () => {
    await expectAsync(submitButton.isDisabled()).toBeResolvedTo(true);
  });

  it('should form be invalid initially', async () => {
    expect(component.loginGroup.valid).toBeFalse();
  });

  it('should be valid after valid input', async () => {

    await setInputValues(EMAIL_USER.email, EMAIL_USER.password);

    expect(component.loginGroup.valid).withContext('formGroup').toBeTrue();
    await expectAsync(submitButton.isDisabled()).withContext('submit').toBeResolvedTo(false);
  });

  it('should validate email login', async () => {
    mockLoginService.loginWithEmail.and.resolveTo({} as LaiksUser);

    const { email, password } = EMAIL_USER;
    await setInputValues(email, password);

    await submitButton.click();

    expect(mockLoginService.loginWithEmail).toHaveBeenCalledOnceWith(email, password);

    expect(harness.routeNativeElement?.textContent).toContain('root-component');
  });

  it('should be redirected after successful login', async () => {
    component = await harness.navigateByUrl('login?redirect=redirected', LoginComponent);

    mockLoginService.loginWithEmail.and.resolveTo({} as LaiksUser);

    const { email, password } = EMAIL_USER;
    await setInputValues(email, password);

    await submitButton.click();

    expect(mockLoginService.loginWithEmail).toHaveBeenCalledOnceWith(email, password);

    expect(harness.routeNativeElement?.textContent).toContain('redirected-component');

  });

  async function setInputValues(email: string, password: string) {
    const emailInput = await emailField.getControl(MatInputHarness);
    const passwordInput = await passwordField.getControl(MatInputHarness);

    await emailInput?.setValue(email);
    await passwordInput?.setValue(password);

  }

});
