import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatAutocompleteModule, MatFormFieldModule, MatInputModule,
  MatChipsModule, MatTabsModule, MatTableModule, MatSelectModule,
  MatCheckboxModule, MatIconModule, MatSortModule, MatButtonModule,
  MatSnackBarModule, MatPaginatorModule, MatExpansionModule,
  MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatStepperModule,
  MatCardModule, MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    MatAutocompleteModule, MatFormFieldModule, MatInputModule,
    MatChipsModule, MatTabsModule, MatTableModule, MatSelectModule,
    MatCheckboxModule, MatIconModule, MatSortModule, MatButtonModule,
    MatSnackBarModule, MatPaginatorModule, MatExpansionModule,
    MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatStepperModule,
    MatCardModule, MatTooltipModule
  ],
  exports: [
    MatAutocompleteModule, MatFormFieldModule, MatInputModule,
    MatChipsModule, MatTabsModule, MatTableModule, MatSelectModule,
    MatCheckboxModule, MatIconModule, MatSortModule, MatButtonModule,
    MatSnackBarModule, MatPaginatorModule, MatExpansionModule,
    MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatStepperModule,
    MatCardModule, MatTooltipModule
  ],
})

export class MaterialModule { }
