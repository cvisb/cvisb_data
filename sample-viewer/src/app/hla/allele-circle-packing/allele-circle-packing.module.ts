import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- components ---
import { AlleleCirclePackingComponent } from './allele-circle-packing.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ AlleleCirclePackingComponent ],
  exports: [ AlleleCirclePackingComponent ]
})
export class AlleleCirclePackingModule { }
