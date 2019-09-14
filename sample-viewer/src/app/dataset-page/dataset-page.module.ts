import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- components ---
import { DatasetPageComponent } from './dataset-page.component';
import { DatasetPageNavComponent } from './dataset-page-nav/dataset-page-nav.component';
import { FileMetadataComponent } from '../dataset/file-metadata/file-metadata.component';
import { MdObjectComponent } from '../dataset/file-metadata/md-object/md-object.component';

// --- modules ---
import { FileListModule } from '../file-list/file-list.module';
import { RouterModule } from '@angular/router';
import { EmbedJsonldModule } from '../embed-jsonld/embed-jsonld.module';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FileListModule,
    EmbedJsonldModule
  ],
  declarations: [
    DatasetPageComponent,
    DatasetPageNavComponent,
    FileMetadataComponent,
    MdObjectComponent
  ],
  exports: [
    DatasetPageComponent
  ]
})
export class DatasetPageModule { }
