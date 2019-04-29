import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripWhitespacePipe } from '../_pipes/strip-whitespace.pipe';
import { FilterLocusPipe } from '../_pipes/filter-locus.pipe';
import { GetKeysPipe } from '../_pipes/get-keys.pipe';
// import { StripWhitespacePipe, SloppyMarkdownPipe } from '../_pipes';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ StripWhitespacePipe, FilterLocusPipe, GetKeysPipe ],
  providers: [ StripWhitespacePipe, FilterLocusPipe, GetKeysPipe ],
  exports: [ StripWhitespacePipe, FilterLocusPipe, GetKeysPipe ]
})
export class PipesModule { }
