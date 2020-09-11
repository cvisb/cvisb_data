import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EpidemiologyRoutingModule } from './epidemiology-routing.module';
import { EpiTimeComponent } from './epi-time/epi-time.component';
import { EpidemiologyComponent } from './epidemiology.component';
import { SeroStatusComponent } from './sero-status/sero-status.component';


@NgModule({
  declarations: [EpiTimeComponent, EpidemiologyComponent, SeroStatusComponent],
  imports: [
    CommonModule,
    EpidemiologyRoutingModule
  ]

})
export class EpidemiologyModule { }
