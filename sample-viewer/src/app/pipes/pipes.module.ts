import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripWhitespacePipe } from '../_pipes/strip-whitespace.pipe';
import { FilterLocusPipe } from '../_pipes/filter-locus.pipe';
// import { StripWhitespacePipe, SloppyMarkdownPipe } from '../_pipes';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StripWhitespacePipe, FilterLocusPipe],
  providers: [StripWhitespacePipe, FilterLocusPipe],
  exports: [StripWhitespacePipe, FilterLocusPipe]
})
export class PipesModule { }
