import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable, firstValueFrom, from, throwError } from 'rxjs';
import { loginGuard } from './login.guard';
import { LoginService } from './login.service';

describe('loginGuard', async () => {
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const urlPath = '/data';
  const expectedUrl = '/login';
  const expectedQueryParams = { redirect: urlPath };

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj<LoginService>(loginGuard.name, [
      'loginObserver',
    ]);
    mockRouter = jasmine.createSpyObj<Router>(loginGuard.name, [
      'navigate',
      'createUrlTree',
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
        provideExperimentalZonelessChangeDetection(),
      ],
    });
  });

  it('should return false if user is not logged in', async () => {
    mockIsLoggedInFalse();
    const authenticated = await runLoginGuardWithContext(
      getLoginGuardWithDummyUrl(urlPath),
    );
    expect(authenticated).toBeFalsy();
  });

  it('should return true if user is logged in', async () => {
    mockIsLoggedInTrue();
    const authenticated = await runLoginGuardWithContext(
      getLoginGuardWithDummyUrl(urlPath),
    );
    expect(authenticated).toBeTruthy();
  });

  it('should redirect to login with origianl url as parameter when not logged in', async () => {
    mockIsLoggedInFalse();
    const authenticated = await runLoginGuardWithContext(
      getLoginGuardWithDummyUrl(urlPath),
    );
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([expectedUrl], {
      queryParams: expectedQueryParams,
    });
    expect(authenticated).toBeFalsy();
  });

  it('should redirect to login with origianl url as parameter if errors', async () => {
    mockLoginService.loginObserver.and.returnValue(
      throwError(() => 'Authentication Error!'),
    );
    const authenticated = await runLoginGuardWithContext(
      getLoginGuardWithDummyUrl(urlPath),
    );
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([expectedUrl], {
      queryParams: expectedQueryParams,
    });
    expect(authenticated).toBeFalsy();
  });

  function getLoginGuardWithDummyUrl(
    urlPath: string,
  ): () => MaybeAsync<GuardResult> {
    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    const dummyState: RouterStateSnapshot = {
      url: urlPath,
      root: new ActivatedRouteSnapshot(),
    };
    return () => loginGuard(dummyRoute, dummyState);
  }

  async function runLoginGuardWithContext(
    guard: () => MaybeAsync<GuardResult>,
  ): Promise<GuardResult> {
    const result = TestBed.runInInjectionContext(guard);
    const loggedIn =
      result instanceof Observable ? handleObservableResult(result) : result;
    return loggedIn;
  }

  function handleObservableResult<T extends GuardResult>(
    result: Observable<T>,
  ): Promise<T> {
    return firstValueFrom(result);
  }

  const mockIsLoggedInTrue = () => {
    mockLoginService.loginObserver.and.returnValue(from([true, true, false]));
  };
  const mockIsLoggedInFalse = () => {
    mockLoginService.loginObserver.and.returnValue(from([false, false, true]));
  };
  //
});
