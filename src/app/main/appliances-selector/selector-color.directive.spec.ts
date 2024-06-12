import {
  Component,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SelectorColorDirective } from './selector-color.directive';

@Component({
  standalone: true,
  imports: [SelectorColorDirective],
  template: `<div [laiksSelectorColor]="color">Sample text</div>`,
})
class SelectorColorTestComponent {
  color = '';
}

describe('SelectorColorDirective', () => {
  let component: SelectorColorTestComponent;
  let fixture: ComponentFixture<SelectorColorTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorColorTestComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectorColorTestComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(
      By.directive(SelectorColorDirective),
    );
    expect(directive).withContext('by directive').toBeTruthy();

    const sampleText = fixture.nativeElement.querySelector('div');
    expect(sampleText).withContext('by element').toBeTruthy();
  });

  it('should set dark background', () => {
    component.color = '#000000';
    fixture.detectChanges();
    const { styles } = fixture.debugElement.query(
      By.directive(SelectorColorDirective),
    );
    expect(styles['backgroundColor'])
      .withContext('background')
      .toBe('rgb(0, 0, 0)');
    expect(styles['color']).withContext('text').toBe('white');
  });

  it('should set light background', () => {
    component.color = '#FFFFFF';
    fixture.detectChanges();
    const { styles } = fixture.debugElement.query(
      By.directive(SelectorColorDirective),
    );
    expect(styles['backgroundColor'])
      .withContext('background')
      .toBe('rgb(255, 255, 255)');
    expect(styles['color']).withContext('text').toBe('black');
  });
});
