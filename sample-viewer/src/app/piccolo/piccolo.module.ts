import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeeswarmComponent } from './beeswarm/beeswarm.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ BeeswarmComponent ],
  exports: [ BeeswarmComponent ]
})

export class PiccoloModule { }
