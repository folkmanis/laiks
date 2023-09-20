import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { CancelEditConfirmationComponent } from './cancel-edit-confirmation/cancel-edit-confirmation.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

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

  private openComponent<T>(component: ComponentType<T>): Observable<boolean> {
    const dialorgRef = this.dialog.open(component);
    return dialorgRef.afterClosed().pipe(map((resp) => !!resp));
  }
}
