import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvenanceComponent } from './provenance.component';

import { MatButtonModule, MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule
  ],
  declarations: [
    ProvenanceComponent
  ],
  exports: [
    ProvenanceComponent
  ]
})
export class ProvenanceModule { }
