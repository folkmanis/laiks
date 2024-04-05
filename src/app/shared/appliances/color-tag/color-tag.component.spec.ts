import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { ColorTagComponent, DEFAULT_COLOR } from './color-tag.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, DebugElement, signal } from '@angular/core';

const TEST_COLOR = 'rgba(55, 55, 55, 0.8)';

describe('ColorTagComponent', () => {

    let componentElement: DebugElement;
    let fixture: ComponentFixture<ColorTagTestComponent>;

    beforeEach(async () => {

        TestBed.configureTestingModule({
            imports: [ColorTagTestComponent]
        });
        fixture = TestBed.createComponent(ColorTagTestComponent);
        componentElement = fixture.debugElement.query(By.directive(ColorTagComponent));
        fixture.detectChanges();
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

    it('should update color', () => {
        fixture.componentInstance.color.set(TEST_COLOR);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.directive(ColorTagComponent)).styles['backgroundColor']).toBe(TEST_COLOR);
    });

    it('should default to defaults when set to null', () => {
        fixture.componentInstance.color.set(null);
        fixture.detectChanges();
        expect(componentElement.styles['backgroundColor']).toBe(DEFAULT_COLOR);
    });

});

@Component({
    imports: [ColorTagComponent],
    template: `<laiks-color-tag [color]="color()" />`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class ColorTagTestComponent {
    color = signal<string | null>(DEFAULT_COLOR);
}