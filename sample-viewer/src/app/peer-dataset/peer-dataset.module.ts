import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- routing ---
import { PeerDatasetRoutingModule } from './peer-dataset-routing.module';


// --- modules ---
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    PeerDatasetRoutingModule,
    FontAwesomeModule,
    MatButtonModule
  ]
})
export class PeerDatasetModule { }
