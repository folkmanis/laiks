import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { from } from 'rxjs';
import { ConfirmationDialogService } from './confirmation-dialog.service';

describe('ConfirmationDialogService', () => {

  let service: ConfirmationDialogService;

  let fixture: ComponentFixture<ConfirmationDialogServiceTestComponent>;

  let loader: HarnessLoader;

  const spy = jasmine.createSpy('dialogResponse');

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, ConfirmationDialogServiceTestComponent, NoopAnimationsModule],
    });
    await TestBed.compileComponents();
    service = TestBed.inject(ConfirmationDialogService);

    fixture = TestBed.createComponent(ConfirmationDialogServiceTestComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open and close delete confirmation', async () => {

    from(service.delete()).subscribe(spy);
    await cancel();
    expect(spy).withContext('decline').toHaveBeenCalledWith(false);

    from(service.delete()).subscribe(spy);
    await confirm();
    expect(spy).withContext('accept').toHaveBeenCalledWith(true);
  });

  it('should open and close cancel edit confirmation', async () => {
    from(service.cancelEdit()).subscribe(spy);
    await cancel();
    expect(spy).withContext('decline').toHaveBeenCalledWith(false);

    from(service.cancelEdit()).subscribe(spy);
    await confirm();
    expect(spy).withContext('accept').toHaveBeenCalledWith(true);
  });

  it('should open and close custom confirmation component', async () => {
    from(service.openComponent(CustomConfirmationComponent)).subscribe(spy);
    await cancel();
    expect(spy).withContext('decline').toHaveBeenCalledWith(false);

    from(service.openComponent(CustomConfirmationComponent)).subscribe(spy);
    await confirm();
    expect(spy).withContext('accept').toHaveBeenCalledWith(true);
  });

  const cancel = async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ selector: '#cancel-button' }));
    await button.click();
  };

  const confirm = async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ selector: '#confirm-button' }));
    await button.click();
  };


});


@Component({
  template: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ConfirmationDialogServiceTestComponent { }

@Component({
  template: `
      <button mat-button mat-dialog-close id="cancel-button">Nē</button>
      <button mat-raised-button class="tertiary-button" [mat-dialog-close]="true" id="confirm-button">Jā</button>
            `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
})
class CustomConfirmationComponent { }