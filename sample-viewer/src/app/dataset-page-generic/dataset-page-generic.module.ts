import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetPageGenericRoutingModule } from './dataset-page-generic-routing.module';
import { DatasetPageModule } from '../dataset-page/dataset-page.module';
import { DatasetPageGenericComponent } from './dataset-page-generic.component';

@NgModule({
  declarations: [DatasetPageGenericComponent],
  imports: [
    CommonModule,
    DatasetPageGenericRoutingModule,
    DatasetPageModule
  ]
})

export class DatasetPageGenericModule { }
