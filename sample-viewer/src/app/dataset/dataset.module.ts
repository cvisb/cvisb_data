import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetRoutingModule } from './dataset-routing.module';


// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { DatasetSummaryModule } from '../dataset-summary/dataset-summary.module';
import { AdminModule } from '../admin/admin.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// --- components ---
import { DatasetComponent } from './dataset.component'

// --- services ---
import { getDatasetsService } from '../_services';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
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
