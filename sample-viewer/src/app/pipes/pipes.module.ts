import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripWhitespacePipe } from '../_pipes/strip-whitespace.pipe';
import { FilterLocusPipe } from '../_pipes/filter-locus.pipe';
import { GetKeysPipe } from '../_pipes/get-keys.pipe';
import { DateRangePipe } from '../_pipes/date-range.pipe';
import { FilterByAltIDPipe } from '../_pipes/filter-by-alt-id.pipe';
import { ExperimentObjectPipe } from '../_pipes/experiment-object.pipe';
import { SloppyMarkdownPipe } from '../_pipes/sloppy-markdown.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StripWhitespacePipe, FilterLocusPipe, GetKeysPipe, DateRangePipe, FilterByAltIDPipe, ExperimentObjectPipe, SloppyMarkdownPipe
  ],
  providers: [
    StripWhitespacePipe, FilterLocusPipe, GetKeysPipe, DateRangePipe, FilterByAltIDPipe, ExperimentObjectPipe, SloppyMarkdownPipe
  ],
  exports: [
    StripWhitespacePipe, FilterLocusPipe, GetKeysPipe, DateRangePipe, FilterByAltIDPipe, ExperimentObjectPipe, SloppyMarkdownPipe
  ]
})

export class PipesModule { }
