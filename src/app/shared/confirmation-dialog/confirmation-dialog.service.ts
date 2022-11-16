import { Injectable } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { CancelEditConfirmationComponent } from './cancel-edit-confirmation/cancel-edit-confirmation.component';
import { Observable, map, tap } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  delete(): Observable<boolean> {
    return this.openComponent(DeleteConfirmationComponent);
  }

  cancelEdit(): Observable<boolean> {
    return this.openComponent(CancelEditConfirmationComponent);
  }

  private openComponent<T>(component: ComponentType<T>): Observable<boolean> {
    const dialorgRef = this.dialog.open(component);
    return dialorgRef.afterClosed().pipe(
      map(resp => !!resp),
    );

  }

}
