import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HlaRoutingModule } from './hla-routing.module';

// --- components ---
import { HlaPageComponent } from './hla-page.component';
import { AlleleBarComponent } from './allele-bar/allele-bar.component';
import { HlaComparisonComponent } from './hla-comparison/hla-comparison.component';
import { HlaSummaryComponent } from './hla-summary/hla-summary.component';
import { AlleleHistComponent } from './allele-hist/allele-hist.component';
import { AlleleCountComponent } from './allele-count/allele-count.component';
import { NovelAllelesComponent } from './novel-alleles/novel-alleles.component';
import { SmallMultipleComparisonComponent } from './hla-comparison/small-multiple-comparison/small-multiple-comparison.component';
import { ComparisonBarplotComponent } from './hla-comparison/comparison-barplot/comparison-barplot.component';


// --- modules ---
import { DatasetPageModule } from '../dataset-page/dataset-page.module';
import { AlleleCirclePackingModule } from '../hla/allele-circle-packing/allele-circle-packing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltersModule } from '../filters/filters.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// --- services ---
import { DatasetResolver } from '../_services/get-datasets.resolver';
import { HlaResolver } from '../_services/hla.resolver';

// --- pipes ---
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FiltersModule,
    HlaRoutingModule,
    DatasetPageModule,
    AlleleCirclePackingModule,
    PipesModule
  ],
  declarations: [
    AlleleBarComponent,
    HlaPageComponent,
    HlaComparisonComponent,
    HlaSummaryComponent,
    AlleleHistComponent,
    NovelAllelesComponent,
    SmallMultipleComparisonComponent,
    ComparisonBarplotComponent,
    AlleleCountComponent
  ],
  exports: [
    AlleleBarComponent
  ],
  providers: [
    DatasetResolver,
    HlaResolver
  ]
})
export class HlaModule { }
