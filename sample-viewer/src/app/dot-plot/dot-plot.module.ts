import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotPlotComponent } from './dot-plot.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DotPlotComponent],
  exports: [DotPlotComponent]
})
export class DotPlotModule { }
