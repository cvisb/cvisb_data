import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlleleBarComponent } from './allele-bar/allele-bar.component';

import { SloppyMarkdownPipe } from '../_pipes/sloppy-markdown.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AlleleBarComponent, SloppyMarkdownPipe,],
  exports: [
    AlleleBarComponent, SloppyMarkdownPipe]
})
export class HlaModule { }
