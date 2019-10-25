import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';

// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FiltersModule } from '../filters/filters.module';
import { DownloadBtnModule } from '../download-btn/download-btn.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { PipesModule } from '../pipes/pipes.module';
import { PatientTimepointsModule } from '../patient-timepoints/patient-timepoints.module';

// --- components ---
import { PatientComponent } from './patient.component';
import { FilterPatientsComponent } from './filter-patients/filter-patients.component';
import { PatientTableComponent } from './patient-table/patient-table.component';

// --- services ---
import { PatientsResolver } from '../_services/patients.resolver';
import { AllPatientsResolver } from '../_services/allpatients.resolver';

@NgModule({
  imports: [
    CommonModule,
    PatientRoutingModule,
    RouterModule,
    MaterialModule,
    FiltersModule,
    DownloadBtnModule,
    SvgIconModule,
    PipesModule,
    PatientTimepointsModule
  ],
  declarations: [
    PatientComponent,
    FilterPatientsComponent,
    PatientTableComponent
  ],
  providers: [
    PatientsResolver,
    AllPatientsResolver
  ]
})
export class PatientModule { }
