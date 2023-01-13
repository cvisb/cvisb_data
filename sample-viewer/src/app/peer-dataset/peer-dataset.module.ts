import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- routing ---
import { PeerDatasetRoutingModule } from './peer-dataset-routing.module';

import { PeerDatasetComponent } from "./peer-dataset.component";

// --- modules ---
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';

import { AdminModule } from '../admin/admin.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    PeerDatasetRoutingModule,
    FontAwesomeModule,
    MatButtonModule,
    AdminModule,
    MatProgressSpinnerModule
  ],
  declarations: [PeerDatasetComponent]
})
export class PeerDatasetModule { }
