import { BrowserModule } from '@angular/platform-browser';
// import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// --- Modules ---
import { AppRoutingModule } from './/app-routing.module';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { AdminModule, PipesModule } from '.';
import { FormatCitationModule } from './format-citation/format-citation.module';
import { EncodeHttpParamsInterceptor } from './_models/encode-http-params-interceptor';
import { EmbedJsonldModule } from './embed-jsonld/embed-jsonld.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// --- Services ---
import { MyHttpClient } from './_services/http-cookies.service';
import { DatePipe } from '@angular/common';
import { DatasetResolver } from './_services/get-datasets.resolver';


// --- Components ---
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SchemaComponent } from './schema/schema.component';
import { FilterFilesComponent } from './dataset/filter-files/filter-files.component';
import { SampleMetadataComponent } from "./_dialogs/sample-metadata/sample-metadata.component";

// import { FiltersModule } from './filters/filters.module';
import { SvgIconModule } from './svg-icon/svg-icon.module';
// import { TestComponent } from './test/test.component';
// import { ViralSequencingModule } from './viral-sequencing/viral-sequencing.module';
// import { DownloadBtnModule } from './download-btn/download-btn.module';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FilterFilesComponent,
    SchemaComponent,
    FooterComponent,
    SampleMetadataComponent
    // TestComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'sample-viewer' }),
    BrowserTransferStateModule,
    // TransferHttpCacheModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    PipesModule,
    AppRoutingModule,
    AdminModule,
    FormatCitationModule,
    Angulartics2Module.forRoot(), // Google Analytics
    EmbedJsonldModule,
    // FiltersModule,
    SvgIconModule,
    MatTooltipModule, 
    // ViralSequencingModule,
    // DownloadBtnModule,
    // LeafletModule
  ],
  exports: [
  ],
  providers: [
    MyHttpClient,
    DatasetResolver,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncodeHttpParamsInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    SampleMetadataComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
