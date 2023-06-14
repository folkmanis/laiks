import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule } from '@angular/material/dialog';
import { first, of } from 'rxjs';
import { PowerAppliance } from 'src/app/np-data/lib/power-appliance.interface';
import { dishWasher, washer } from '../../np-data/lib/price-calculator.service.spec';
import { ApplianceFormComponent, APPLIANCES_BY_NAME } from './appliance-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


const testAppliances: PowerAppliance[] = [dishWasher, washer];

const TEST_APPLIANCE: PowerAppliance = { ...dishWasher };

describe('ApplianceFormComponent', () => {
  let component: ApplianceFormComponent;
  let fixture: ComponentFixture<ApplianceFormComponent>;

  let saveButton: HTMLButtonElement;
  let deleteButton: HTMLButtonElement;
  let cancelButton: HTMLButtonElement;
  let nameInput: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApplianceFormComponent,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [{
        provide: APPLIANCES_BY_NAME,
        useValue: (name: string) => of(testAppliances.filter(appl => appl.name === name)),
      }]
    });
    fixture = TestBed.createComponent(ApplianceFormComponent);
    component = fixture.componentInstance;

    component.initialValue = TEST_APPLIANCE;
    component.id = 'AADD';
    fixture.detectChanges();

    saveButton = fixture.nativeElement.querySelector('button.save');
    deleteButton = fixture.nativeElement.querySelector('button.delete');
    cancelButton = fixture.nativeElement.querySelector('button.cancel');
    nameInput = fixture.nativeElement.querySelector('[formControlName="name"]');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(saveButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
  });

  it('should set initial value', () => {
    expect(component.applianceForm.value).toEqual(TEST_APPLIANCE);
    expect(component.applianceForm.status).toBe('VALID');
  });

  it('should NOT validate used name', () => {
    nameInput.value = washer.name;
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.applianceForm.value.name).toBe(washer.name);
    expect(component.applianceForm.status).toBe('INVALID');
  });

  it('should disable only save button when invalid', () => {

    component.applianceForm.controls.name.setErrors({ duplicate: 'value' });
    fixture.detectChanges();

    expect(saveButton.disabled).toBeTrue();
    expect(deleteButton.disabled).toBeFalse();
    expect(cancelButton.disabled).toBeFalse();

  });

  it('should emit only cancel event on cancel', () => {

    let cancelCalled = false;
    component.cancel.pipe(first()).subscribe(() => cancelCalled = true);
    let saveCalled = false;
    component.save.pipe(first()).subscribe(() => saveCalled = true);
    let deleteCalled = false;
    component.delete.pipe(first()).subscribe(() => deleteCalled = true);

    cancelButton.click();
    expect(cancelCalled).toBeTrue();
  });

  it('should disable on initial setup', () => {
    expect(saveButton.disabled).toBeTrue();
  });

  it('should submit value on save', () => {

    const updAppl = { ...TEST_APPLIANCE, name: TEST_APPLIANCE.name + '2' };

    let appliance: PowerAppliance | undefined;
    component.save.pipe(first()).subscribe(value => {
      appliance = value;
    });

    nameInput.value = updAppl.name;
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    saveButton.click();

    expect(updAppl).not.toEqual(TEST_APPLIANCE);
    expect(appliance).toEqual(updAppl);

  });

});
