import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SvgIconComponent } from './svg-icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SvgIconComponent
  ],
  exports: [
    SvgIconComponent
  ]
})
export class SvgIconModule { }
