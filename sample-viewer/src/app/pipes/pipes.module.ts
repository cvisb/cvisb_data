import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripWhitespacePipe } from '../_pipes/strip-whitespace.pipe';
import { FilterLocusPipe } from '../_pipes/filter-locus.pipe';
import { GetKeysPipe } from '../_pipes/get-keys.pipe';
import { DateRangePipe } from '../_pipes/date-range.pipe';
// import { StripWhitespacePipe, SloppyMarkdownPipe } from '../_pipes';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ StripWhitespacePipe, FilterLocusPipe, GetKeysPipe, DateRangePipe ],
  providers: [ StripWhitespacePipe, FilterLocusPipe, GetKeysPipe, DateRangePipe ],
  exports: [ StripWhitespacePipe, FilterLocusPipe, GetKeysPipe, DateRangePipe ]
})
export class PipesModule { }
