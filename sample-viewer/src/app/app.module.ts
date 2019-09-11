import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// --- Modules ---
import { AppRoutingModule } from './/app-routing.module';
import { MaterialModule } from './material.module';
import { HttpModule } from '@angular/http'; // Though outdated, required as per https://github.com/angular/angular/issues/20101 to remove "StaticInjector" error
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AdminModule, PipesModule, HlaModule } from '.';
import { FormatCitationModule } from './format-citation/format-citation.module';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { EncodeHttpParamsInterceptor } from './_models/encode-http-params-interceptor';

// Services
import { MyHttpClient } from './_services/http-cookies.service';
import { DatePipe } from '@angular/common';
import { DatasetResolver, HlaResolver } from './_services/';
import { EmbedJsonldDirective } from './_directives/';


// Dialogue boxes
import { SampleMetadataComponent, SpinnerPopupComponent } from './_dialogs/index';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SchemaComponent } from './schema/schema.component';

import { AddSampleTypesComponent } from './add-samples/add-sample-types/add-sample-types.component';
import { BulkEditComponent } from './sample/bulk-edit/bulk-edit.component';
import { FileMetadataComponent } from './dataset/file-metadata/file-metadata.component';
import { FilterFilesComponent } from './dataset/filter-files/filter-files.component';
import { DatasetPageComponent } from './dataset-page/dataset-page.component';
import { DatasetPageNavComponent } from './dataset-page/dataset-page-nav/dataset-page-nav.component';
import { HlaPageComponent } from './hla/hla-page.component';
import { HlaComparisonComponent } from './hla/hla-comparison/hla-comparison.component';
import { HlaSummaryComponent } from './hla/hla-summary/hla-summary.component';
import { AlleleHistComponent } from './hla/allele-hist/allele-hist.component';
import { AlleleCountComponent } from './hla/allele-count/allele-count.component';
import { NovelAllelesComponent } from './hla/novel-alleles/novel-alleles.component';
import { SmallMultipleComparisonComponent } from './hla/hla-comparison/small-multiple-comparison/small-multiple-comparison.component';
import { ComparisonBarplotComponent } from './hla/hla-comparison/comparison-barplot/comparison-barplot.component';
import { MdObjectComponent } from './dataset/file-metadata/md-object/md-object.component';

@NgModule({
  declarations: [
    AppComponent,
    AddSampleTypesComponent,
    HeaderComponent,
    BulkEditComponent,
    FileMetadataComponent,
    FilterFilesComponent,
    SampleMetadataComponent,
    SpinnerPopupComponent,
    SchemaComponent,
    DatasetPageComponent,
    DatasetPageNavComponent,
    HlaPageComponent,
    HlaSummaryComponent,
    HlaComparisonComponent,
    AlleleHistComponent,
    AlleleCountComponent,
    NovelAllelesComponent,
    SmallMultipleComparisonComponent,
    ComparisonBarplotComponent,
    MdObjectComponent,
    FooterComponent,
    HomeComponent,
    EmbedJsonldDirective,

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'sample-viewer' }),
    TransferHttpCacheModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    PipesModule,
    AppRoutingModule,
    AdminModule,
    FormatCitationModule,
    HlaModule,
    Angulartics2Module.forRoot(), // Google Analytics
  ],
  exports: [
  ],
  providers: [
    MyHttpClient,
    DatePipe,
    DatasetResolver,
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
