import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientTimepointsComponent } from './patient-timepoints.component';
// import { SampleMetadataComponent } from '../_dialogs/sample-metadata/sample-metadata.component';
import { PipesModule } from '../pipes/pipes.module';

import { MatTooltipModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatExpansionModule,
    PipesModule
  ],
  declarations: [PatientTimepointsComponent],
  exports: [PatientTimepointsComponent]
})
export class PatientTimepointsModule { }
