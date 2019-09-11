import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadBtnComponent } from './download-btn.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DownloadBtnComponent
  ],
  exports: [
    DownloadBtnComponent
  ]
})
export class DownloadBtnModule { }
