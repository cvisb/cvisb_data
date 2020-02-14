import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientTimepointsComponent } from './patient-timepoints.component';
// import { SampleMetadataComponent } from '../_dialogs/sample-metadata/sample-metadata.component';
import { PipesModule } from '../pipes/pipes.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

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
