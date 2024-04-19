import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialogHarness } from "@angular/material/dialog/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DeleteConfirmationComponent } from './delete-confirmation.component';

describe('DeleteConfirmation', () => {

    let dialog: MatDialogHarness;
    let fixture: ComponentFixture<DeleteConfirmationTestComponent>;

    let loader: HarnessLoader;

    let actions: HarnessLoader;
    let cancelButton: MatButtonHarness;
    let confirmButton: MatButtonHarness;

    beforeEach(async () => {

        TestBed.configureTestingModule({
            imports: [DeleteConfirmationTestComponent, NoopAnimationsModule],
        });
        await TestBed.compileComponents();

        fixture = TestBed.createComponent(DeleteConfirmationTestComponent);

        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        dialog = await loader.getHarness(MatDialogHarness);

        actions = await dialog.getChildLoader('mat-dialog-actions');
        cancelButton = await actions.getHarness(MatButtonHarness.with({ selector: '#cancel-button' }));
        confirmButton = await actions.getHarness(MatButtonHarness.with({ selector: '#confirm-button', variant: 'raised' }));
    });

    it('should create', () => {
        expect(dialog).toBeTruthy();
    });

    it('should contain buttons', () => {
        expect(actions).toBeTruthy();
        expect(cancelButton).toBeTruthy();
        expect(confirmButton).toBeTruthy();
    });

    it('should be styled with tertiary style on cancel button', async () => {
        const button = await confirmButton.host();
        const hasStyle = await button.hasClass('tertiary-button');
        expect(hasStyle).toBeTrue();
    });

    it('should return empty on cancel click', async () => {
        const spy = jasmine.createSpy('DialogResponse');
        fixture.componentInstance.dialogRef.afterClosed().subscribe(spy);
        await cancelButton.click();
        expect(spy).toHaveBeenCalledWith('');
    });

    it('should return undefined on escape', async () => {
        const spy = jasmine.createSpy('DialogResponse');
        fixture.componentInstance.dialogRef.afterClosed().subscribe(spy);
        await dialog.close();
        expect(spy).toHaveBeenCalledWith(undefined);
    });

    it('should return true on confirmation', async () => {
        const spy = jasmine.createSpy('DialogResponse');
        fixture.componentInstance.dialogRef.afterClosed().subscribe(spy);
        await confirmButton.click();
        expect(spy).toHaveBeenCalledWith(true);
    });
});

@Component({
    template: '',
    imports: [DeleteConfirmationComponent, MatDialogModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class DeleteConfirmationTestComponent {
    dialogRef: MatDialogRef<DeleteConfirmationComponent>;
    constructor(dialog: MatDialog) {
        this.dialogRef = dialog.open(DeleteConfirmationComponent);
    }
}