import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';

// --- common helper modules ---
import { RouterModule } from '@angular/router';
import {
  MatExpansionModule, MatTableModule, MatIconModule, MatSortModule, MatPaginatorModule, MatTooltipModule, MatProgressSpinnerModule, MatButtonModule
} from '@angular/material';
import { FiltersModule } from '../filters/filters.module';
import { DownloadBtnModule } from '../download-btn/download-btn.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { PipesModule } from '../pipes/pipes.module';
import { PatientTimepointsModule } from '../patient-timepoints/patient-timepoints.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// --- components ---
import { PatientComponent } from './patient.component';
import { FilterPatientsComponent } from './filter-patients/filter-patients.component';
import { PatientTableComponent } from './patient-table/patient-table.component';

// --- services ---
import { PatientsResolver } from '../_services/patients.resolver';

@NgModule({
  imports: [
    CommonModule,
    PatientRoutingModule,
    RouterModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    FiltersModule,
    DownloadBtnModule,
    SvgIconModule,
    PipesModule,
    PatientTimepointsModule,
    FontAwesomeModule
  ],
  declarations: [
    PatientComponent,
    FilterPatientsComponent,
    PatientTableComponent
  ],
  providers: [
    PatientsResolver
  ]
})
export class PatientModule { }
