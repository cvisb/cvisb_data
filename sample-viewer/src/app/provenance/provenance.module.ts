import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Modules ---
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { FormatCitationModule } from '../format-citation/format-citation.module';

// --- Components ---
import { ProvenanceComponent } from './provenance.component';
import { ProvenanceTitleComponent } from './provenance-title/provenance-title.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormatCitationModule,
    SvgIconModule
  ],
  declarations: [
    ProvenanceComponent,
    ProvenanceTitleComponent
  ],
  exports: [
    ProvenanceComponent,
    ProvenanceTitleComponent
  ]
})
export class ProvenanceModule { }
