import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { CancelEditConfirmationComponent } from './cancel-edit-confirmation/cancel-edit-confirmation.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { YesNoConfirmationComponent } from './yes-no-confirmation/yes-no-confirmation.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  private dialog = inject(MatDialog);

  delete(): Observable<boolean> {
    return this.openComponent(DeleteConfirmationComponent);
  }

  cancelEdit(): Observable<boolean> {
    return this.openComponent(CancelEditConfirmationComponent);
  }

  yesNoConfirmation(text: string, title: string) {
    return this.openComponent(YesNoConfirmationComponent, {
      data: { text, title },
    });
  }

  private openComponent<T>(
    component: ComponentType<T>,
    config?: MatDialogConfig
  ): Observable<boolean> {
    const dialorgRef = this.dialog.open(component, config);
    return dialorgRef.afterClosed().pipe(map((resp) => !!resp));
  }
}
