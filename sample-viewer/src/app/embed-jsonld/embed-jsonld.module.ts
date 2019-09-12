import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmbedJsonldDirective } from '../_directives';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EmbedJsonldDirective
  ],
  exports: [
    EmbedJsonldDirective
  ]
})
export class EmbedJsonldModule { }
