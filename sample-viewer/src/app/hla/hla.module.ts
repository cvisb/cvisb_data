import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- components ---
import { AlleleBarComponent } from './allele-bar/allele-bar.component';

// --- pipes ---
import { SloppyMarkdownPipe } from '../_pipes/sloppy-markdown.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlleleBarComponent,
    SloppyMarkdownPipe,
  ],
  exports: [
    AlleleBarComponent,
    SloppyMarkdownPipe]
})
export class HlaModule { }
