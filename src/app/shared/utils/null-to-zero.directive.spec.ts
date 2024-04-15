import { Component, DebugElement } from '@angular/core';
import { NullToZeroDirective } from "./null-to-zero.directive";
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
    standalone: true,
    template: `<input [(ngModel)]="value" laiksNullToZero id="value" name="value" type="number" />`,
    imports: [FormsModule, NullToZeroDirective]
})
class DirectiveTestComponent {
    value = null as null | number;
}

describe('NullToZeroDirective', () => {

    let fixture: ComponentFixture<DirectiveTestComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DirectiveTestComponent]
        });
        fixture = TestBed.createComponent(DirectiveTestComponent);
        input = fixture.nativeElement.querySelector('input');
        input.focus();

        fixture.detectChanges();
    });

    it('should create', () => {
        const directive = fixture.debugElement.query(By.directive(NullToZeroDirective));
        expect(directive).toBeTruthy();
    });

    it('should change null to zero', () => {
        setInputValue('');
        expect(fixture.componentInstance.value).toBe(0);
    });

    it('should change input to zero', () => {
        setInputValue('');
        expect(input.value).toBe('0');
    });

    function setInputValue(value: any) {
        input.value = value;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
    }

});