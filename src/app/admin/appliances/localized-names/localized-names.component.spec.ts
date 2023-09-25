import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizedNamesComponent } from './localized-names.component';

describe('LocalizedNamesComponent', () => {
  let component: LocalizedNamesComponent;
  let fixture: ComponentFixture<LocalizedNamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LocalizedNamesComponent]
    });
    fixture = TestBed.createComponent(LocalizedNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
