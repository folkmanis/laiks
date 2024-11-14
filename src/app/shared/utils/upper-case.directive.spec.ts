import {
  Component,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { UpperCaseDirective } from './upper-case.directive';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  imports: [UpperCaseDirective, FormsModule],
  standalone: true,
  template: `<input
    [(ngModel)]="value"
    laiksUpperCase
    name="value"
    id="value"
  />`,
})
class DirectiveTestComponent {
  value = '';
}

describe('UpperCaseDirective', () => {
  let fixture: ComponentFixture<DirectiveTestComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [DirectiveTestComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(DirectiveTestComponent);
    input = fixture.nativeElement.querySelector('input');

    input.focus();
    await fixture.whenStable();
  });

  it('should create', () => {
    const directive = fixture.debugElement.query(
      By.directive(UpperCaseDirective),
    );
    expect(directive).toBeTruthy();
  });

  it('should change case', async () => {
    const initial = 'abcd123';
    const expected = 'ABCD123';

    input.value = initial;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.value).toBe(expected);
  });
});
