import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';

// --- modules ---
import { MatButtonModule } from '@angular/material/button';

// --- components ---
import { UploadComponent } from './upload.component';

@NgModule({
  imports: [
    CommonModule,
    UploadRoutingModule,
    MatButtonModule
  ],
  declarations: [
    UploadComponent
  ]
})
export class UploadModule { }
