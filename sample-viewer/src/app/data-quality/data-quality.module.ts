import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataQualityRoutingModule } from './data-quality-routing.module';
import { DataQualityComponent } from './data-quality.component';
import { MissingDataComponent } from './missing-data/missing-data.component';

@NgModule({
  declarations: [DataQualityComponent, MissingDataComponent],
  imports: [
    CommonModule,
    DataQualityRoutingModule
  ]
})

export class DataQualityModule { }
