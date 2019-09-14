import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadDataRoutingModule } from './upload-data-routing.module';

// --- modules ---
import { MaterialModule } from '../../material.module';

// --- components ---
import { AddDataComponent } from '../add-data/add-data.component';
import { DataUploadComponent } from '../data-upload/data-upload.component';

@NgModule({
  imports: [
    CommonModule,
    UploadDataRoutingModule,
    MaterialModule
  ],
  declarations: [
    AddDataComponent,
    DataUploadComponent
  ]
})
export class UploadDataModule { }
