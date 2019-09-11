import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientPageRoutingModule } from './patient-page-routing.module';

// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { PipesModule } from '../pipes/pipes.module';
import { PatientTimepointsModule } from '../patient-timepoints/patient-timepoints.module';
import { FormatCitationModule } from '../format-citation/format-citation.module';
import { FileListModule } from '../file-list/file-list.module';
import { AlleleCirclePackingModule } from '../hla/allele-circle-packing/allele-circle-packing.module';

// --- components ---
import { PatientPageComponent } from './patient-page.component';
import { PatientNavComponent } from './patient-nav/patient-nav.component';
import { PatientDemographicsComponent } from './patient-demographics/patient-demographics.component'
import { PatientSymptomsComponent } from './patient-symptoms/patient-symptoms.component';
import { PatientElisasComponent } from './patient-elisas/patient-elisas.component';
import { PatientRelationshipsComponent } from './patient-relationships/patient-relationships.component';
import { PatientCitationsComponent } from './patient-citations/patient-citations.component';
import { PatientRelatedComponent } from './patient-related/patient-related.component';
import { PatientSamplesComponent } from './patient-samples/patient-samples.component';
import { PatientDatesComponent } from './patient-dates/patient-dates.component';
import { PatientHlaComponent } from './patient-hla/patient-hla.component';
import { PatientViralSeqComponent } from './patient-viral-seq/patient-viral-seq.component';
import { PatientSerologyComponent } from './patient-serology/patient-serology.component';

// --- services ---
import { MyHttpClient } from '../_services/http-cookies.service';
import { DatePipe } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    PatientPageRoutingModule,
    RouterModule,
    MaterialModule,
    SvgIconModule,
    PipesModule,
    PatientTimepointsModule,
    FormatCitationModule,
    FileListModule,
    AlleleCirclePackingModule
  ],
  declarations: [
    PatientPageComponent,
    PatientNavComponent,
    PatientDemographicsComponent,
    PatientRelatedComponent,
    PatientSamplesComponent,
    PatientSymptomsComponent,
    PatientElisasComponent,
    PatientRelationshipsComponent,
    PatientDatesComponent,
    PatientCitationsComponent,
    PatientHlaComponent,
    PatientViralSeqComponent,
    PatientSerologyComponent
  ],
  providers: [
    MyHttpClient,
    DatePipe
  ]
})
export class PatientPageModule { }
