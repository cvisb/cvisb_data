import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// --- Modules ---
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'; // Though outdated, required as per https://github.com/angular/angular/issues/20101 to remove "StaticInjector" error
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { MaterialModule } from './material.module';
import { AdminModule, PipesModule } from '.';
import { FormatCitationModule } from './format-citation/format-citation.module';
import { EncodeHttpParamsInterceptor } from './_models/encode-http-params-interceptor';
import { EmbedJsonldModule } from './embed-jsonld/embed-jsonld.module';

// Services
import { MyHttpClient } from './_services/http-cookies.service';
import { DatePipe } from '@angular/common';


// Dialogue boxes
import { SampleMetadataComponent, SpinnerPopupComponent } from './_dialogs/index';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SchemaComponent } from './schema/schema.component';

import { BulkEditComponent } from './sample/bulk-edit/bulk-edit.component';
import { FilterFilesComponent } from './dataset/filter-files/filter-files.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BulkEditComponent,
    FilterFilesComponent,
    SampleMetadataComponent,
    SpinnerPopupComponent,
    SchemaComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'sample-viewer' }),
    TransferHttpCacheModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    AppRoutingModule,
    AdminModule,
    FormatCitationModule,
    Angulartics2Module.forRoot(), // Google Analytics
    EmbedJsonldModule
  ],
  exports: [
  ],
  providers: [
    MyHttpClient,
    DatePipe,
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
