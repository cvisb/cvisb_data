import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareComponent } from './software.component';

// --- routing ---
import { SoftwareRoutingModule } from './software-routing.module';

@NgModule({
  declarations: [SoftwareComponent],
  imports: [
    CommonModule,
    SoftwareRoutingModule
  ]
})
export class SoftwareModule { }
