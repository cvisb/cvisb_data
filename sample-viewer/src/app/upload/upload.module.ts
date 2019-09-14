import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';

// --- modules ---
import { MaterialModule } from '../material.module';

// --- components ---
import { UploadComponent } from './upload.component';

@NgModule({
  imports: [
    CommonModule,
    UploadRoutingModule,
    MaterialModule
  ],
  declarations: [
    UploadComponent
  ]
})
export class UploadModule { }
