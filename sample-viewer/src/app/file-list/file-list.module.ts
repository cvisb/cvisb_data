import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- modules ---
import { MatTableModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatTooltipModule, MatIconModule } from '@angular/material';
import { PipesModule } from '../pipes/pipes.module';

// --- components ---
import { FileListComponent } from './file-list.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    PipesModule
  ],
  declarations: [
    FileListComponent
  ],
  exports: [
    FileListComponent
  ]
})
export class FileListModule { }
