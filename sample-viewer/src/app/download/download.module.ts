import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadRoutingModule } from './download-routing.module';
import { DownloadComponent } from "./download.component";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FiltersModule } from '../filters/filters.module';
import { ChoroplethModule } from '../choropleth/choropleth.module';
import { DotPlotModule } from '../dot-plot/dot-plot.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';

@NgModule({
  declarations: [DownloadComponent],
  imports: [
    CommonModule,
    DownloadRoutingModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
    FiltersModule,
    ChoroplethModule,
    SvgIconModule,
    DotPlotModule
  ]
})
export class DownloadModule { }
