import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientPageComponent } from './patient-page.component';

const routes: Routes = [
  { path: '', component: PatientPageComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientPageRoutingModule { }
