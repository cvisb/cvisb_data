import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadBtnComponent } from './download-btn.component';

import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule
  ],
  declarations: [
    DownloadBtnComponent
  ],
  exports: [
    DownloadBtnComponent
  ]
})
export class DownloadBtnModule { }
