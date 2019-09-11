import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// Modules
import { AppRoutingModule } from './/app-routing.module';
import { MaterialModule } from './material.module';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms'
// import { NgSelectModule } from '@ng-select/ng-select';
import { HttpModule } from '@angular/http'; // Though outdated, required as per https://github.com/angular/angular/issues/20101 to remove "StaticInjector" error
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AdminModule, PipesModule, HlaModule } from '.';
// import { AdminModule, PipesModule, HlaModule, PiccoloModule, ViralSequencingModule } from '.';

import { EncodeHttpParamsInterceptor } from './_models/encode-http-params-interceptor';

// Services
import { MyHttpClient } from './_services/http-cookies.service';
import { DatePipe } from '@angular/common';
import { DatasetResolver, PatientsResolver, AllPatientsResolver, HlaResolver, SamplesResolver } from './_services/';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

// Dialogue boxes
import { SampleMetadataComponent, SpinnerPopupComponent } from './_dialogs/index';

// Components
import { AppComponent } from './app.component';
// import { SampleComponent } from './sample/sample.component';
// import { AddSamplesComponent } from './add-samples/add-samples.component';
// import { AddSampleTypesComponent } from './add-samples/add-sample-types/add-sample-types.component';
// import { SampleUploadComponent } from './add-samples/sample-upload/sample-upload.component';
import { HeaderComponent } from './header/header.component';
// import { BulkEditComponent } from './sample/bulk-edit/bulk-edit.component';
// import { FileListComponent } from './dataset/file-list/file-list.component';
// import { FileMetadataComponent } from './dataset/file-metadata/file-metadata.component';
// import { FilterFilesComponent } from './dataset/filter-files/filter-files.component';
// import { DatasetComponent } from './dataset/dataset.component';
// import { DatasetPageComponent } from './dataset-page/dataset-page.component';
// import { DatasetPageNavComponent } from './dataset-page/dataset-page-nav/dataset-page-nav.component';
// import { HlaPageComponent } from './dataset-page/hla-page/hla-page.component';
// import { HlaComparisonComponent } from './dataset-page/hla-page/hla-comparison/hla-comparison.component';
// import { HlaSummaryComponent } from './dataset-page/hla-page/hla-summary/hla-summary.component';
// import { AlleleCirclePackingComponent } from './dataset-page/hla-page/allele-circle-packing/allele-circle-packing.component';
// import { AlleleHistComponent } from './dataset-page/hla-page/allele-hist/allele-hist.component';
// import { AlleleCountComponent } from './dataset-page/hla-page/allele-count/allele-count.component';
// import { NovelAllelesComponent } from './dataset-page/hla-page/novel-alleles/novel-alleles.component';
// import { SmallMultipleComparisonComponent } from './dataset-page/hla-page/hla-comparison/small-multiple-comparison/small-multiple-comparison.component';
// import { ComparisonBarplotComponent } from './dataset-page/hla-page/hla-comparison/comparison-barplot/comparison-barplot.component';
// import { MdObjectComponent } from './dataset/file-metadata/md-object/md-object.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { EmbedJsonldDirective } from './_directives/';
// import { PatientPageComponent } from './patient-page/patient-page.component';

// Patient page components
// import {
//   PatientHlaComponent, PatientNavComponent, PatientSamplesComponent, PatientSerologyComponent, PatientDemographicsComponent, PatientRelatedComponent
// } from './patient-page';

// import { SchemaComponent } from './schema/schema.component';
// import { AddStepperComponent } from './add-samples/add-stepper/add-stepper.component';
// import { UploadStepperComponent } from './add-samples/upload-stepper/upload-stepper.component';
// import { CheckIdsComponent } from './add-samples/check-ids/check-ids.component';
// import { PreviewSamplesComponent } from './add-samples/preview-samples/preview-samples.component';
// import { FrontendSampleValidationComponent } from './add-samples/frontend-sample-validation/frontend-sample-validation.component';
// import { PreviewDifferencesComponent } from './add-samples/preview-differences/preview-differences.component';
// import { AddPatientsComponent } from './add-patients/add-patients/add-patients.component';
// import { PatientUploadComponent } from './add-patients/patient-upload/patient-upload.component';
// import { PatientSymptomsComponent } from './patient-page/patient-symptoms/patient-symptoms.component';
// import { PatientElisasComponent } from './patient-page/patient-elisas/patient-elisas.component';
// import { PatientRelationshipsComponent } from './patient-page/patient-relationships/patient-relationships.component';
// import { FilterSampleComponent } from './sample/filter-sample/filter-sample.component';
// import { SubmitSamplesComponent } from './add-samples/submit-samples/submit-samples.component';
// import { UploadComponent } from './upload/upload.component';
// import { PatientDatesComponent } from './patient-page/patient-dates/patient-dates.component';
// import { CheckDupesComponent } from './add-samples/check-dupes/check-dupes.component';
// import { PreviewAdditionsComponent } from './add-samples/preview-additions/preview-additions.component';
// import { CombineDupesComponent } from './add-samples/combine-dupes/combine-dupes.component';
// import { PatientCitationsComponent } from './patient-page/patient-citations/patient-citations.component';
// import { SampleTableComponent } from './sample/sample-table/sample-table.component';
// import { AddDataComponent } from './add-data/add-data/add-data.component';
// import { DataUploadComponent } from './add-data/data-upload/data-upload.component';
// import { PatientViralSeqComponent } from './patient-page/patient-viral-seq/patient-viral-seq.component';
import { FormatCitationComponent } from './format-citation/format-citation.component';


@NgModule({
  declarations: [
    AppComponent,
    // SampleComponent,
    // AddSamplesComponent,
    // AddSampleTypesComponent,
    // SampleUploadComponent,
    HeaderComponent,
    // BulkEditComponent,
    // FileListComponent,
    // FileMetadataComponent,
    // FilterFilesComponent,
    // FilterSampleComponent,
    // DatasetComponent,
    SampleMetadataComponent,
    SpinnerPopupComponent,
    // DatasetPageComponent,
    // DatasetPageNavComponent,
    // HlaPageComponent,
    // HlaSummaryComponent,
    // HlaComparisonComponent,
    // AlleleHistComponent,
    // AlleleCirclePackingComponent,
    // AlleleCountComponent,
    // NovelAllelesComponent,
    // SmallMultipleComparisonComponent,
    // ComparisonBarplotComponent,
    // MdObjectComponent,
    FooterComponent,
    HomeComponent,
    EmbedJsonldDirective,
    // PatientPageComponent,
    //
    // PatientHlaComponent,
    // PatientNavComponent,
    // PatientRelatedComponent,
    // PatientSamplesComponent,
    // PatientSerologyComponent,
    // PatientDemographicsComponent,
    // SchemaComponent,
    // AddStepperComponent,
    //
    // UploadStepperComponent,
    // CheckIdsComponent,
    // PreviewSamplesComponent,
    // FrontendSampleValidationComponent,
    // PreviewDifferencesComponent,
    //
    // AddPatientsComponent,
    // PatientUploadComponent,
    // PatientSymptomsComponent,
    // PatientElisasComponent,
    // PatientRelationshipsComponent,
    // SubmitSamplesComponent,
    // UploadComponent,
    // PatientDatesComponent,
    // CheckDupesComponent,
    // PreviewAdditionsComponent,
    // CombineDupesComponent,
    //
    // PatientCitationsComponent,
    // SampleTableComponent,
    // AddDataComponent,
    // DataUploadComponent,
    // PatientViralSeqComponent,
    FormatCitationComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'sample-viewer' }),
    TransferHttpCacheModule,
    HttpModule,
    HttpClientModule,
    // FormsModule,
    // ReactiveFormsModule,
    // NgSelectModule,
    BrowserAnimationsModule,
    MaterialModule,
    PipesModule,
    AppRoutingModule,
    // ViralSequencingModule,
    AdminModule,
    HlaModule,
    // PiccoloModule,
    Angulartics2Module.forRoot(), // Google Analytics
  ],
  exports: [
  ],
  providers: [
    MyHttpClient,
    DatePipe,
    DatasetResolver,
    SamplesResolver,
    HlaResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncodeHttpParamsInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    SampleMetadataComponent,
    SpinnerPopupComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
