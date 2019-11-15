import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- modules ----
import { FiltersModule } from '../filters/filters.module';
import { ChoroplethModule } from '../choropleth/choropleth.module';
import { DotPlotModule } from '../dot-plot/dot-plot.module';

// --- compownta ---
import { DatasetSummaryComponent } from '../dataset/dataset-summary/dataset-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FiltersModule,
    ChoroplethModule,
    DotPlotModule
  ],
  declarations: [ DatasetSummaryComponent ],
  exports: [ DatasetSummaryComponent ]
})
export class DatasetSummaryModule { }
