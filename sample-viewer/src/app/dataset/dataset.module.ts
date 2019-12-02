import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetRoutingModule } from './dataset-routing.module';


// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { DatasetSummaryModule } from '../dataset-summary/dataset-summary.module';
// import { MaterialModule } from '../material.module';
// import { DownloadBtnModule } from '../download-btn/download-btn.module';
import { AdminModule } from '../admin/admin.module';

// --- components ---
import { DatasetComponent } from './dataset.component'

// --- services ---
import { getDatasetsService } from '../_services';

@NgModule({
  imports: [
    CommonModule,
    DatasetRoutingModule,
    RouterModule,
    SvgIconModule,
    DatasetSummaryModule,
    AdminModule
  ],
  declarations: [
    DatasetComponent
  ],
  providers: [
    getDatasetsService
  ]
})
export class DatasetModule { }
