import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- routing ---
import { HomeRoutingModule } from './home-routing.module';

// --- components ---
import { HomeComponent } from './home.component';

// --- services ---
import { GetExperimentsService } from '../_services/get-experiments.service';

// --- modules ---
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule,
    MatButtonModule
  ],
  providers: [
    GetExperimentsService
  ]
})
export class HomeModule { }
