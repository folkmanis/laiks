import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { CancelEditConfirmationComponent } from './cancel-edit-confirmation/cancel-edit-confirmation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        DeleteConfirmationComponent,
        CancelEditConfirmationComponent,
    ]
})
export class ConfirmationDialogModule { }
