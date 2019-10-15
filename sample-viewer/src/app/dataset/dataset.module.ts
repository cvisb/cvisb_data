import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetRoutingModule } from './dataset-routing.module';


// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { DatasetSummaryModule } from '../dataset-summary/dataset-summary.module';
// import { MaterialModule } from '../material.module';
// import { DownloadBtnModule } from '../download-btn/download-btn.module';

// --- components ---
import { DatasetComponent } from './dataset.component'

// --- services ---
import { MyHttpClient } from '../_services/http-cookies.service';

@NgModule({
  imports: [
    CommonModule,
    DatasetRoutingModule,
    RouterModule,
    SvgIconModule,

    DatasetSummaryModule
  ],
  declarations: [
    DatasetComponent
  ],
  providers: [
    MyHttpClient
  ]
})
export class DatasetModule { }
