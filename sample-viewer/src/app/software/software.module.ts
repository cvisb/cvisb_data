import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareComponent } from './software.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

// --- routing ---
import { SoftwareRoutingModule } from './software-routing.module';

@NgModule({
  declarations: [SoftwareComponent],
  imports: [
    CommonModule,
    SoftwareRoutingModule,
    MatChipsModule, MatButtonModule
  ]
})
export class SoftwareModule { }
