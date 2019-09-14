import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadPatientsRoutingModule } from './upload-patients-routing.module';

// --- modules ---
import { MaterialModule } from '../../material.module';

// --- components ---
import { AddPatientsComponent } from '../add-patients/add-patients.component';
import { PatientUploadComponent } from '../patient-upload/patient-upload.component';

@NgModule({
  imports: [
    CommonModule,
    UploadPatientsRoutingModule,
    MaterialModule
  ],
  declarations: [
    AddPatientsComponent,
    PatientUploadComponent
  ]
})
export class UploadPatientsModule { }
