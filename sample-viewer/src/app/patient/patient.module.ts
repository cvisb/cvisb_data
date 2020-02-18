import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';

// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
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
