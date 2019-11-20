import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadDataRoutingModule } from './download-data-routing.module';
import { DownloadDataComponent } from './download-data.component';

// --- modules ---
import { AdminModule } from '../admin/admin.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DownloadDataComponent],
  imports: [
    CommonModule,
    DownloadDataRoutingModule,
    AdminModule,
    RouterModule
  ]
})

export class DownloadDataModule { }
