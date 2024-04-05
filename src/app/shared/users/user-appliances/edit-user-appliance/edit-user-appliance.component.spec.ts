import { TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { PowerAppliance, SystemAppliancesService } from '@shared/appliances';
import { dishWasher, washer } from '@shared/np-data/price-calculator.service.spec';
import { UsersService } from '@shared/users/users.service';
import { BehaviorSubject, of } from 'rxjs';
import { TEST_USER } from "../../users.service.spec";
import { EditUserApplianceComponent } from './edit-user-appliance.component';
import { canDeactivateGuard } from '@shared/utils';
import { Component } from '@angular/core';

const fakeSystemAppliances = [dishWasher, washer]
  .map((appliance, idx) => ({ ...appliance, id: 'id_' + idx }));

const TEST_IDX = '1';

const presetAppliance = { ...washer, name: 'mašīna2' };

describe('EditUserApplianceComponent', () => {
  let component: EditUserApplianceComponent;
  let harness: RouterTestingHarness;
  let loader: HarnessLoader;

  let saveButton: MatButtonHarness;
  let cancelButton: MatButtonHarness;
  let copyFromButton: MatButtonHarness;

  let mockDialogService: jasmine.SpyObj<MatDialog>;
  let mockSystemAppliancesService: jasmine.SpyObj<SystemAppliancesService>;
  let mockUserService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {

    createMockServices();

    TestBed.configureTestingModule({
      imports: [EditUserApplianceComponent, NoopAnimationsModule],
      providers: [
        provideRouter([
          {
            path: 'new',
            component: EditUserApplianceComponent,
            canDeactivate: [canDeactivateGuard],
            data: { idx: null, id: TEST_USER.id },
          },
          {
            path: ':idx',
            component: EditUserApplianceComponent,
            data: { id: TEST_USER.id },
            canDeactivate: [canDeactivateGuard],
          },
        ], withComponentInputBinding()),
        { provide: UsersService, useValue: mockUserService },
        { provide: SystemAppliancesService, useValue: mockSystemAppliancesService },
        { provide: MatDialog, useValue: mockDialogService },
      ],
    });

    harness = await RouterTestingHarness.create();

  });

  it('should create', async () => {
    await navigateToExisting();
    expect(component).withContext('component').toBeTruthy();
    expect(saveButton).withContext('save button').toBeTruthy();
    expect(cancelButton).withContext('cancel button').toBeTruthy();
  });

  it('should resolve user and appliance', async () => {
    await navigateToExisting();
    const appliance = TEST_USER.appliances[TEST_IDX];

    expect(component.id()).toBe(TEST_USER.id);
    expect(component.initialValue()).toEqual(appliance);
  });

  it('should initialize save button with update text', async () => {
    await navigateToExisting();
    const text = await saveButton.getText();
    expect(text).toBe('Saglabāt');
  });

  it('should initialize save button with create text', async () => {
    await navigateToNew();
    const text = await saveButton.getText();
    expect(text).toBe('Izveidot');
  });

  it('should form be correctly initialized', async () => {
    await navigateToExisting();
    const appliance = TEST_USER.appliances[TEST_IDX];
    const form = component.applianceForm;
    expect(form.value).toEqual(appliance);
    expect(form.pristine).toBeTrue();
    expect(form.valid).toBeTrue();
    expect(form.errors).toEqual(null);
  });

  it('should initialy disable save button', async () => {
    await navigateToExisting();
    const isDisabled = await saveButton.isDisabled();
    expect(isDisabled).toBeTrue();
  });

  it('should enable save after valid changes', async () => {
    await navigateToExisting();

    makeValidChanges();

    const isDisabled = await saveButton.isDisabled();
    expect(isDisabled).toBeFalse();
  });

  it('should be disabled after invalid input', async () => {
    await navigateToExisting();

    makeInvalidChanges();

    const isDisabled = await saveButton.isDisabled();
    expect(isDisabled).withContext('save disabled').toBeTrue();
    expect(component.applianceForm.valid).withContext('valid').toBeFalse();
    expect(component.applianceForm.errors).withContext('errors').toBeTruthy();
  });

  it('should save changes', async () => {
    await navigateToExisting();
    makeValidChanges();

    await saveButton.click();
    expect(mockUserService.updateUser).toHaveBeenCalled();
  });

  it('should not make changes on cancel', async () => {
    await navigateToExisting();
    await cancelButton.click();
    expect(mockUserService.updateUser).not.toHaveBeenCalled();
  });

  it('should open dialog on copy-from button and set form value', async () => {

    await navigateToNew();

    const dialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>('DialogRef', ['afterClosed']);
    dialogRef.afterClosed.and.returnValue(of(presetAppliance));
    mockDialogService.open.and.returnValue(dialogRef);
    await copyFromButton.click();

    const form = component.applianceForm;

    expect(mockDialogService.open).withContext('dialog opened').toHaveBeenCalled();

    expect(form.value).withContext('form value').toEqual(presetAppliance);
    expect(form.pristine).withContext('pristine').toBeFalse();
    expect(form.valid).withContext('valid').toBeTrue();
    expect(form.errors).withContext('errors').toBeFalsy();
  });

  it('should make no changes on copy-from with cancel', async () => {
    await navigateToNew();
    const form = component.applianceForm;
    const dialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>('DialogRef', ['afterClosed']);
    dialogRef.afterClosed.and.returnValue(of(''));
    mockDialogService.open.and.returnValue(dialogRef);
    await copyFromButton.click();

    expect(mockDialogService.open).withContext('dialog opened').toHaveBeenCalled();
    expect(form.pristine).withContext('pristine').toBe(true);
    expect(form.value).withContext('value').toEqual(component.initialValue());

  });

  function makeValidChanges() {
    return makeChanges({ name: 'updated name' });
  }

  function makeInvalidChanges() {
    return makeChanges({ name: '' });
  }

  function makeChanges(update: Partial<PowerAppliance>): PowerAppliance {
    const form = component.applianceForm;
    const updatedAppliance = { ...form.value, ...update };
    form.setValue(updatedAppliance);
    form.markAsDirty();
    harness.detectChanges();
    return updatedAppliance;
  }

  function createMockServices() {
    const userFlow = new BehaviorSubject({ ...TEST_USER });
    mockUserService = jasmine.createSpyObj<UsersService>('UsersService', ['userByIdFlow', 'updateUser']);
    mockUserService.userByIdFlow.and.returnValue(userFlow);
    mockUserService.updateUser.and.returnValue(Promise.resolve());

    mockSystemAppliancesService = jasmine.createSpyObj<SystemAppliancesService>(
      'SystemAppliancesService',
      ['getPowerAppliances']
    );
    mockSystemAppliancesService.getPowerAppliances.and.returnValue(of(fakeSystemAppliances));

    mockDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  }

  async function navigateToExisting() {
    return navigateToAppliance(TEST_IDX);
  }

  async function navigateToNew() {
    return navigateToAppliance('new');
  }

  async function navigateToAppliance(idx: string) {

    component = await harness.navigateByUrl(idx, EditUserApplianceComponent);
    loader = TestbedHarnessEnvironment.loader(harness.fixture);
    saveButton = await loader.getHarness(MatButtonHarness.with({ selector: '#save-button' }));
    cancelButton = await loader.getHarness(MatButtonHarness.with({ selector: '#cancel-button' }));
    copyFromButton = await loader.getHarness(MatButtonHarness.with({ selector: '#from-presets-button' }));

    harness.detectChanges();

  }
});
