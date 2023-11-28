import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueProvider, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddApplianceDialogComponent } from './add-appliance-dialog.component';

const dialogDataProvider: ValueProvider = {
  provide: MAT_DIALOG_DATA,
  useValue: {
    appliances: signal([]),
    locale: 'lv',
  },
};

describe('AddApplianceDialogComponent', () => {
  let component: AddApplianceDialogComponent;
  let fixture: ComponentFixture<AddApplianceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddApplianceDialogComponent],
      providers: [dialogDataProvider],
    });
    fixture = TestBed.createComponent(AddApplianceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
