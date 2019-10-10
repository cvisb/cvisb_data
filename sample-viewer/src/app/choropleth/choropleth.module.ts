import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoroplethComponent } from './choropleth.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ChoroplethComponent],
  exports: [ChoroplethComponent]
})
export class ChoroplethModule { }
