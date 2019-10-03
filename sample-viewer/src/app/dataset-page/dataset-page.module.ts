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
import { DatasetSourceComponent } from './dataset-source/dataset-source.component';
import { FormatCitationModule } from '../format-citation/format-citation.module';
import { FormatPublisherModule } from '../format-publisher/format-publisher.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FileListModule,
    FormatCitationModule,
    FormatPublisherModule,
    EmbedJsonldModule
  ],
  declarations: [
    DatasetPageComponent,
    DatasetPageNavComponent,
    FileMetadataComponent,
    MdObjectComponent,
    DatasetSourceComponent
  ],
  exports: [
    DatasetPageComponent
  ]
})
export class DatasetPageModule { }
