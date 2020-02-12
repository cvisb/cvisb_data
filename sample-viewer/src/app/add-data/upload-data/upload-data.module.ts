import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadDataRoutingModule } from './upload-data-routing.module';

// --- modules ---
import { MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';

// --- components ---
import { AddDataComponent } from '../add-data/add-data.component';
import { DataUploadComponent } from '../data-upload/data-upload.component';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    UploadDataRoutingModule
  ],
  declarations: [
    AddDataComponent,
    DataUploadComponent
  ]
})
export class UploadDataModule { }
