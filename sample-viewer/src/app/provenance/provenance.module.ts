import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvenanceComponent } from './provenance.component';

import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule
  ],
  declarations: [
    ProvenanceComponent
  ],
  exports: [
    ProvenanceComponent
  ]
})
export class ProvenanceModule { }
