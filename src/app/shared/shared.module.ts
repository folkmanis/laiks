import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { NumberSignPipe } from './number-sign.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MinutesToHoursPipe } from './minutes-to-hours.pipe';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDividerModule,
    MatDialogModule,
  ],
  declarations: [
    NumberSignPipe,
    MinutesToHoursPipe,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDividerModule,
    MatDialogModule,
    NumberSignPipe,
    MinutesToHoursPipe,
  ]
})
export class SharedModule { }
