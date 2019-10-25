import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- routing ---
import { HomeRoutingModule } from './home-routing.module';

// --- components ---
import { HomeComponent } from './home.component';

// --- services ---
import { GetExperimentsService } from '../_services/get-experiments.service';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  providers: [
    GetExperimentsService
  ]
})
export class HomeModule { }
