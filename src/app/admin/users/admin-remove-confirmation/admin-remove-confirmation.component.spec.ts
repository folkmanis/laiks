import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRemoveConfirmationComponent } from './admin-remove-confirmation.component';

describe('AdminRemoveConfirmationComponent', () => {
  let component: AdminRemoveConfirmationComponent;
  let fixture: ComponentFixture<AdminRemoveConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRemoveConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRemoveConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
