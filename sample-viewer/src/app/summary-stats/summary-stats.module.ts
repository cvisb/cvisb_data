import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryStatsRoutingModule } from './summary-stats-routing.module';
import { MaterialModule } from '../material.module';
import { SummaryStatsComponent } from './summary-stats.component';


@NgModule({
  declarations: [SummaryStatsComponent],
  imports: [
    CommonModule,
    SummaryStatsRoutingModule,
    MaterialModule
  ]
})
export class SummaryStatsModule { }
