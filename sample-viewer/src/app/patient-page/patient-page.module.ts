import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientPageRoutingModule } from './patient-page-routing.module';

// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { PipesModule } from '../pipes/pipes.module';
import { PatientTimepointsModule } from '../patient-timepoints/patient-timepoints.module';
import { FormatCitationModule } from '../format-citation/format-citation.module';
import { FileListModule } from '../file-list/file-list.module';
import { AlleleCirclePackingModule } from '../hla/allele-circle-packing/allele-circle-packing.module';
import { ProvenanceModule } from '../provenance/provenance.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
import { PatientWarningComponent } from './patient-warning/patient-warning.component';
import { CorrectionsComponent } from '../_dialogs/corrections/corrections.component';

// --- services ---

@NgModule({
  imports: [
    CommonModule,
    PatientPageRoutingModule,
    RouterModule,
    SvgIconModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    PipesModule,
    PatientTimepointsModule,
    FormatCitationModule,
    FileListModule,
    AlleleCirclePackingModule,
    ProvenanceModule,
    FontAwesomeModule
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
    PatientSerologyComponent,
    PatientWarningComponent,
    CorrectionsComponent
  ],
  providers: [
  ]
})
export class PatientPageModule { }
