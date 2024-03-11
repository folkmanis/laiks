import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CancelEditConfirmationComponent } from './cancel-edit-confirmation/cancel-edit-confirmation.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  private dialog = inject(MatDialog);

  delete(): Promise<boolean> {
    return this.openComponent(DeleteConfirmationComponent);
  }

  cancelEdit(): Promise<boolean> {
    return this.openComponent(CancelEditConfirmationComponent);
  }

  async openComponent<T>(
    component: ComponentType<T>,
    config?: MatDialogConfig
  ): Promise<boolean> {
    const dialorgRef = this.dialog.open(component, config);
    const response = await firstValueFrom(dialorgRef.afterClosed());
    return !!response;
  }
}
