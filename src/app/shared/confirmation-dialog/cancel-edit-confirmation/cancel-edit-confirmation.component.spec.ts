import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEditConfirmationComponent } from './cancel-edit-confirmation.component';

describe('CancelEditConfirmationComponent', () => {
  let component: CancelEditConfirmationComponent;
  let fixture: ComponentFixture<CancelEditConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelEditConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelEditConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
