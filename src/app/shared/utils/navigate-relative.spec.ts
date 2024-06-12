import { TestBed } from '@angular/core/testing';
import { navigateRelative } from './navigate-relative';
import { ActivatedRoute, RouterOutlet, provideRouter } from '@angular/router';
import { Component, inject } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';
import { AsyncPipe } from '@angular/common';

@Component({
  template: `start-component`,
  standalone: true,
  imports: [RouterOutlet],
})
class StartTestComponent {}

@Component({
  template: `root-component`,
  standalone: true,
})
class RootTestComponent {}

@Component({
  template: `child-component {{ (route.queryParams | async)?.test }}`,
  standalone: true,
  imports: [AsyncPipe],
})
class ChildTestComponent {
  route = inject(ActivatedRoute);
}

describe('navigateRelative', () => {
  let harness: RouterTestingHarness;
  let navigate: ReturnType<typeof navigateRelative>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'child-component',
            component: ChildTestComponent,
          },
          {
            path: 'start',
            component: StartTestComponent,
          },
          { path: '', component: RootTestComponent },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/start', StartTestComponent);
    harness.detectChanges();

    TestBed.runInInjectionContext(() => {
      navigate = navigateRelative();
    });
  });

  it('should mount component', async () => {
    expect(harness.routeNativeElement?.innerHTML).toContain('start-component');
  });

  it('should navigate up', async () => {
    await navigate(['..']);
    harness.detectChanges();
    expect(harness.routeNativeElement?.innerHTML).toContain('root-component');
  });

  it('should navigate to child', async () => {
    await navigate(['child-component']);
    harness.detectChanges();
    expect(harness.routeNativeElement?.innerHTML).toContain('child-component');
  });

  it('should navigate with params', async () => {
    await navigate(['child-component'], {
      queryParams: { test: 'test-parameter' },
    });
    harness.detectChanges();
    expect(harness.routeNativeElement?.innerHTML).toContain('test-parameter');
  });
});
