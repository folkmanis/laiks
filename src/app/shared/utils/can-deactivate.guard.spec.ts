import { Component } from '@angular/core';
import {
  canDeactivateGuard,
  CanComponentDeactivate,
} from './can-deactivate.guard';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable } from 'rxjs';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({
  standalone: true,
  template: `start`,
})
class DeactivateTestingComponent implements CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean> = () =>
    true;
}

@Component({
  standalone: true,
  template: `target`,
})
class TargetTestComponent {}

describe('canDeactivateGuard', () => {
  let harness: RouterTestingHarness;
  let component: DeactivateTestingComponent;
  let router: Router;
  let mockGuard: jasmine.Spy;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'target', component: TargetTestComponent },
          {
            path: '',
            component: DeactivateTestingComponent,
            canDeactivate: [canDeactivateGuard],
          },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('', DeactivateTestingComponent);

    router = TestBed.inject(Router);

    mockGuard = jasmine.createSpy('canDeactivate');
  });

  it('should be crated', () => {
    expect(component).toBeTruthy();
    expect(router).toBeTruthy();
  });

  it('should gard be called', async () => {
    component.canDeactivate = mockGuard;
    await router.navigate(['target']);
    expect(mockGuard).toHaveBeenCalled();
  });

  it('should allow naviagtion', async () => {
    mockGuard.and.resolveTo(true);
    await navigate();
    expect(harness.routeNativeElement?.textContent).toContain('target');
  });

  it('should not allow naviagtion', async () => {
    mockGuard.and.resolveTo(false);
    await navigate();
    expect(harness.routeNativeElement?.textContent).not.toContain('target');
  });

  async function navigate() {
    component.canDeactivate = mockGuard;
    await router.navigate(['target']);
  }
});
