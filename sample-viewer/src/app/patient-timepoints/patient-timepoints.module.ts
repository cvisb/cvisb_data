import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientTimepointsComponent } from './patient-timepoints.component';

import { MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  declarations: [PatientTimepointsComponent],
  exports: [PatientTimepointsComponent]
})
export class PatientTimepointsModule { }
