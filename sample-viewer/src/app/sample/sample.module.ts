import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';

// --- common helper modules ---
import { FiltersModule } from '../filters/filters.module';
import { DownloadBtnModule } from '../download-btn/download-btn.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTooltipModule } from '@angular/material';

// --- services ---
import { SamplesResolver } from '../_services/samples.resolver';

// --- Components ---
import { SampleComponent } from './sample.component';
import { FilterSampleComponent } from './filter-sample/filter-sample.component';
import { SampleTableComponent } from './sample-table/sample-table.component';

@NgModule({
  imports: [
    CommonModule,
    SampleRoutingModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    FiltersModule,
    DownloadBtnModule,
    SvgIconModule
  ],
  declarations: [
    SampleComponent,
    FilterSampleComponent,
    SampleTableComponent
  ],
  providers: [
    SamplesResolver
  ]
})

export class SampleModule { }
