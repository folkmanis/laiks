import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { NumberSignPipe } from './number-sign.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  declarations: [
    NumberSignPipe,
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    NumberSignPipe,
    MatSnackBarModule,
  ]
})
export class SharedModule { }
