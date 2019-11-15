import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- components ---
import { FormatPublisherComponent } from './format-publisher.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ FormatPublisherComponent ],
  exports: [ FormatPublisherComponent ]
})
export class FormatPublisherModule { }
