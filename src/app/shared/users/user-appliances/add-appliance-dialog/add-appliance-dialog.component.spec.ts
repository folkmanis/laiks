import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplianceDialogComponent } from './add-appliance-dialog.component';

describe('AddApplianceDialogComponent', () => {
  let component: AddApplianceDialogComponent;
  let fixture: ComponentFixture<AddApplianceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddApplianceDialogComponent]
    });
    fixture = TestBed.createComponent(AddApplianceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
