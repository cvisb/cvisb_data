import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- components ---
import { DatasetPageComponent } from './dataset-page.component';
import { DatasetPageNavComponent } from './dataset-page-nav/dataset-page-nav.component';
import { FileMetadataComponent } from '../dataset/file-metadata/file-metadata.component';
import { MdObjectComponent } from '../dataset/file-metadata/md-object/md-object.component';
import { DatasetCitationComponent } from './dataset-citation/dataset-citation.component';
import { CuratedAlignmentsComponent } from './curated-alignments/curated-alignments.component';

// --- modules ---
import { FileListModule } from '../file-list/file-list.module';
import { RouterModule } from '@angular/router';
import { EmbedJsonldModule } from '../embed-jsonld/embed-jsonld.module';
import { MaterialModule } from '../material.module';
import { DatasetSourceComponent } from './dataset-source/dataset-source.component';
import { FormatCitationModule } from '../format-citation/format-citation.module';
import { FormatPublisherModule } from '../format-publisher/format-publisher.module';
import { DatasetSummaryModule } from '../dataset-summary/dataset-summary.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FileListModule,
    FormatCitationModule,
    FormatPublisherModule,
    DatasetSummaryModule,
    EmbedJsonldModule,
    SvgIconModule
  ],
  declarations: [
    DatasetPageComponent,
    DatasetPageNavComponent,
    FileMetadataComponent,
    MdObjectComponent,
    DatasetSourceComponent,
    DatasetCitationComponent,
    CuratedAlignmentsComponent
  ],
  exports: [
    DatasetPageComponent
  ]
})
export class DatasetPageModule { }
