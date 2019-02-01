import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// Modules
import { AppRoutingModule } from './/app-routing.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpModule } from '@angular/http'; // Though outdated, required as per https://github.com/angular/angular/issues/20101 to remove "StaticInjector" error
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { AdminModule, PipesModule, HlaModule } from '.';

// Guards
import { AuthGuard } from './_guards/auth.guard';

// Services
import { MyHttpClient } from './_services/auth-helper.service';

// Dialogue boxes
import { SampleMetadataComponent } from './_dialogs/index';

// Components
import { AppComponent } from './app.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { SampleComponent } from './sample/sample.component';
import { AddSamplesComponent } from './add-samples/add-samples.component';
import { AddSampleTypesComponent } from './add-samples/add-sample-types/add-sample-types.component';
import { HeaderComponent } from './header/header.component';
import { BulkEditComponent } from './sample/bulk-edit/bulk-edit.component';
import { FileListComponent } from './dataset/file-list/file-list.component';
import { FileMetadataComponent } from './dataset/file-metadata/file-metadata.component';
import { FilterFilesComponent } from './dataset/filter-files/filter-files.component';
import { DatasetComponent } from './dataset/dataset.component';
import { DatasetPageComponent } from './dataset-page/dataset-page.component';
import { DatasetPageNavComponent } from './dataset-page/dataset-page-nav/dataset-page-nav.component';
import { HlaPageComponent } from './dataset-page/hla-page/hla-page.component';
import { HlaComparisonComponent } from './dataset-page/hla-page/hla-comparison/hla-comparison.component';
import { HlaSummaryComponent } from './dataset-page/hla-page/hla-summary/hla-summary.component';
import { AlleleCirclePackingComponent } from './dataset-page/hla-page/allele-circle-packing/allele-circle-packing.component';
import { AlleleHistComponent } from './dataset-page/hla-page/allele-hist/allele-hist.component';
import { AlleleCountComponent } from './dataset-page/hla-page/allele-count/allele-count.component';
import { NovelAllelesComponent } from './dataset-page/hla-page/novel-alleles/novel-alleles.component';
import { SmallMultipleComparisonComponent } from './dataset-page/hla-page/hla-comparison/small-multiple-comparison/small-multiple-comparison.component';
import { ComparisonBarplotComponent } from './dataset-page/hla-page/hla-comparison/comparison-barplot/comparison-barplot.component';
import { MdObjectComponent } from './dataset/file-metadata/md-object/md-object.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { EmbedJsonldDirective } from './_directives/';
import { PatientPageComponent } from './patient-page/patient-page.component';
import { PatientComponent } from './patient/patient.component';
import { FilterPatientsComponent } from './patient/filter-patients/filter-patients.component';
import { PatientTableComponent } from './patient/patient-table/patient-table.component';

// File filter components
import {
  FilterElisasComponent, FilterExperimentComponent, FilterFileTypeComponent,
  FilterLocationComponent, FilterPatientIdComponent, FilterPatientTypeComponent,
  FilterSampleYearComponent, MiniBarplotComponent, MiniDonutComponent, FilterSearchComponent
} from './filters';

// Patient page components
import {
  PatientHlaComponent, PatientNavComponent, PatientSamplesComponent, PatientSerologyComponent, PatientDemographicsComponent, PatientRelatedComponent
} from './patient-page';

import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SchemaComponent } from './schema/schema.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    SampleComponent,
    AddSamplesComponent,
    AddSampleTypesComponent,
    HeaderComponent,
    BulkEditComponent,
    FileListComponent,
    FileMetadataComponent,
    FilterFilesComponent,
    FilterElisasComponent,
    FilterExperimentComponent,
    FilterFileTypeComponent,
    FilterLocationComponent,
    FilterPatientIdComponent,
    FilterPatientTypeComponent,
    FilterSampleYearComponent,
    MiniBarplotComponent,
    MiniDonutComponent,
    FilterSearchComponent,
    DatasetComponent,
    SampleMetadataComponent,
    SvgIconComponent,
    DatasetPageComponent,
    DatasetPageNavComponent,
    HlaPageComponent,
    HlaSummaryComponent,
    HlaComparisonComponent,
    AlleleHistComponent,
    AlleleCirclePackingComponent,
    AlleleCountComponent,
    NovelAllelesComponent,
    SmallMultipleComparisonComponent,
    ComparisonBarplotComponent,
    MdObjectComponent,
    FooterComponent,
    HomeComponent,
    EmbedJsonldDirective,
    PatientPageComponent,
    PatientComponent,
    FilterPatientsComponent,
    PatientTableComponent,
    PatientHlaComponent,
    PatientNavComponent,
    PatientRelatedComponent,
    PatientSamplesComponent,
    PatientSerologyComponent,
    PatientDemographicsComponent,
    LoginComponent,
    UnauthorizedComponent,
    SchemaComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'sample-viewer' }),
    TransferHttpCacheModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    BrowserAnimationsModule,
    MaterialModule,
    PipesModule,
    AppRoutingModule,
    AdminModule,
    HlaModule,
  ],
  exports: [
    // EmbedJsonldDirective
  ],
  providers: [MyHttpClient, AuthGuard],
  entryComponents: [
    SampleMetadataComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
