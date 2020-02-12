import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadSamplesRoutingModule } from './upload-samples-routing.module';

// --- modules ---
import {
  MatFormFieldModule,
  MatTableModule, MatSelectModule,
  MatCheckboxModule, MatSortModule, MatButtonModule,
  MatPaginatorModule, MatStepperModule, MatExpansionModule,
  MatTooltipModule, MatRadioModule, MatIconModule,
  MatProgressBarModule
} from '@angular/material';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// --- components ---
import { AddSamplesComponent } from '../add-samples.component';
import { UploadStepperComponent } from '../upload-stepper/upload-stepper.component';
import { SampleUploadComponent } from '../sample-upload/sample-upload.component';
import { FrontendSampleValidationComponent } from '../frontend-sample-validation/frontend-sample-validation.component';
import { PreviewAdditionsComponent } from '../preview-additions/preview-additions.component';
import { PreviewDifferencesComponent } from '../preview-differences/preview-differences.component';
import { SubmitSamplesComponent } from '../submit-samples/submit-samples.component';
import { CheckIdsComponent } from '../check-ids/check-ids.component';
import { PreviewSamplesComponent } from '../preview-samples/preview-samples.component';
import { CheckDupesComponent } from '../check-dupes/check-dupes.component';
import { CombineDupesComponent } from '../combine-dupes/combine-dupes.component';

@NgModule({
  imports: [
    CommonModule,
    UploadSamplesRoutingModule,
    MatFormFieldModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatStepperModule,
    MatTooltipModule,
    MatExpansionModule,
    MatIconModule,
    MatRadioModule,
    MatProgressBarModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddSamplesComponent,
    UploadStepperComponent,
    SampleUploadComponent,
    UploadStepperComponent,
    CheckIdsComponent,
    PreviewSamplesComponent,
    FrontendSampleValidationComponent,
    PreviewDifferencesComponent,
    SubmitSamplesComponent,
    CheckDupesComponent,
    PreviewAdditionsComponent,
    CombineDupesComponent,

  ]
})
export class UploadSamplesModule { }
