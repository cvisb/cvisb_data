import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatAutocompleteModule, MatFormFieldModule, MatInputModule,
  MatChipsModule, MatTabsModule, MatTableModule, MatSelectModule,
  MatCheckboxModule, MatIconModule, MatSortModule, MatButtonModule,
  MatSnackBarModule, MatPaginatorModule, MatExpansionModule, MatDialogModule,
  MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatStepperModule,
  MatCardModule, MatTooltipModule,  MatProgressSpinnerModule, MatRadioModule,
  MatProgressBarModule
} from '@angular/material';

@NgModule({
  imports: [
    MatAutocompleteModule, MatFormFieldModule, MatInputModule,
    MatChipsModule, MatTabsModule, MatTableModule, MatSelectModule,
    MatCheckboxModule, MatIconModule, MatSortModule, MatButtonModule,
    MatSnackBarModule, MatPaginatorModule, MatExpansionModule, MatDialogModule,
    MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatStepperModule,
    MatCardModule, MatTooltipModule,  MatProgressSpinnerModule, MatRadioModule,
    MatProgressBarModule
  ],
  exports: [
    MatAutocompleteModule, MatFormFieldModule, MatInputModule,
    MatChipsModule, MatTabsModule, MatTableModule, MatSelectModule,
    MatCheckboxModule, MatIconModule, MatSortModule, MatButtonModule,
    MatSnackBarModule, MatPaginatorModule, MatExpansionModule, MatDialogModule,
    MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatStepperModule,
    MatCardModule, MatTooltipModule,  MatProgressSpinnerModule, MatRadioModule,
    MatProgressBarModule
  ],
})

export class MaterialModule { }
