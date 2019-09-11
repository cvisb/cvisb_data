import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientTimepointsComponent } from './patient-timepoints.component';

import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [PatientTimepointsComponent],
  exports: [PatientTimepointsComponent]
})
export class PatientTimepointsModule { }
