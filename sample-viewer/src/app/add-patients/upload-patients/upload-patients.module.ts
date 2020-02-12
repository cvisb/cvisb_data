import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadPatientsRoutingModule } from './upload-patients-routing.module';

// --- modules ---
import { MatButtonModule, MatProgressBarModule } from '@angular/material';


// --- components ---
import { AddPatientsComponent } from '../add-patients/add-patients.component';
import { PatientUploadComponent } from '../patient-upload/patient-upload.component';

@NgModule({
  imports: [
    CommonModule,
    UploadPatientsRoutingModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  declarations: [
    AddPatientsComponent,
    PatientUploadComponent
  ]
})
export class UploadPatientsModule { }
