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

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule
  ],
  providers: [
    GetExperimentsService
  ]
})
export class HomeModule { }
