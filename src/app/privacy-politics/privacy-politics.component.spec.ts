import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPoliticsComponent } from './privacy-politics.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('PrivacyPoliticsComponent', () => {
  let component: PrivacyPoliticsComponent;
  let fixture: ComponentFixture<PrivacyPoliticsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [PrivacyPoliticsComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(PrivacyPoliticsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
