import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatCitationComponent } from '../format-citation/format-citation.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormatCitationComponent],
  exports: [FormatCitationComponent]
})

export class FormatCitationModule { }
