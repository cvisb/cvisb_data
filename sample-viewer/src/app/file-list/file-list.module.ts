import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- modules ---
import { MaterialModule } from '../material.module';
import { PipesModule } from '../pipes/pipes.module';

// --- components ---
import { FileListComponent } from './file-list.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
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
