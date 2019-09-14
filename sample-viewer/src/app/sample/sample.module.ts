import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';

// --- common helper modules ---
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FiltersModule } from '../filters/filters.module';
import { DownloadBtnModule } from '../download-btn/download-btn.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
// import { PipesModule } from '../pipes/pipes.module';
// import { PatientTimepointsModule } from '../patient-timepoints/patient-timepoints.module';

// --- services ---
import { MyHttpClient } from '../_services/http-cookies.service';
import { DatePipe } from '@angular/common';
import { SamplesResolver } from '../_services/samples.resolver';

// --- Components ---
import { SampleComponent } from './sample.component';
import { FilterSampleComponent } from './filter-sample/filter-sample.component';
import { SampleTableComponent } from './sample-table/sample-table.component';

@NgModule({
  imports: [
    CommonModule,
    SampleRoutingModule,
    MaterialModule,
    FiltersModule,
    DownloadBtnModule,
    SvgIconModule
  ],
  declarations: [
    SampleComponent,
    FilterSampleComponent,
    SampleTableComponent
  ],
  providers: [
    MyHttpClient,
    DatePipe,
    SamplesResolver
  ]
})

export class SampleModule { }
