import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  provideExperimentalZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorTagComponent, DEFAULT_COLOR } from './color-tag.component';

const TEST_COLOR = 'rgba(55, 55, 55, 0.8)';

describe('ColorTagComponent', () => {
  let componentElement: DebugElement;
  let fixture: ComponentFixture<ColorTagTestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ColorTagTestComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(ColorTagTestComponent);
    componentElement = fixture.debugElement.query(
      By.directive(ColorTagComponent),
    );
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(componentElement).toBeTruthy();
  });

  it('should have default background', () => {
    expect(componentElement.styles['backgroundColor']).toBe(DEFAULT_COLOR);
  });

  it('should measure exact size', () => {
    // 24px width + 2 x 2px border = 28 px
    const nativeElement = componentElement.nativeElement as HTMLElement;
    const { width, height } = nativeElement.getBoundingClientRect();
    expect(width).toBe(28);
    expect(height).toBe(28);
  });

  it('should update color', async () => {
    fixture.componentInstance.color.set(TEST_COLOR);
    await fixture.whenStable();
    expect(
      fixture.debugElement.query(By.directive(ColorTagComponent)).styles[
        'backgroundColor'
      ],
    ).toBe(TEST_COLOR);
  });

  it('should default to defaults when set to null', async () => {
    fixture.componentInstance.color.set(null);
    await fixture.whenStable();
    expect(componentElement.styles['backgroundColor']).toBe(DEFAULT_COLOR);
  });
});

@Component({
    imports: [ColorTagComponent],
    template: `<laiks-color-tag [color]="color()" />`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
class ColorTagTestComponent {
  color = signal<string | null>(DEFAULT_COLOR);
}
