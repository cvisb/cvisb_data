import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadExptsRoutingModule } from './download-expts-routing.module';
import { DownloadExptsComponent } from './download-expts.component';


@NgModule({
  declarations: [DownloadExptsComponent],
  imports: [
    CommonModule,
    DownloadExptsRoutingModule
  ]
})
export class DownloadExptsModule { }
