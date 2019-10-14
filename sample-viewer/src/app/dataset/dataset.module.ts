import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetRoutingModule } from './dataset-routing.module';


// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { FiltersModule } from '../filters/filters.module';
import { ChoroplethModule } from '../choropleth/choropleth.module';
import { DotPlotModule } from '../dot-plot/dot-plot.module';
// import { MaterialModule } from '../material.module';
// import { DownloadBtnModule } from '../download-btn/download-btn.module';

// --- components ---
import { DatasetComponent } from './dataset.component'

// --- services ---
import { MyHttpClient } from '../_services/http-cookies.service';
import { DatasetSummaryComponent } from './dataset-summary/dataset-summary.component';

@NgModule({
  imports: [
    CommonModule,
    DatasetRoutingModule,
    RouterModule,
    SvgIconModule,
    FiltersModule,
    ChoroplethModule,
    DotPlotModule
  ],
  declarations: [
    DatasetComponent,
    DatasetSummaryComponent
  ],
  providers: [
    MyHttpClient
  ]
})
export class DatasetModule { }
