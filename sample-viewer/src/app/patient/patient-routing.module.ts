import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientComponent } from './patient.component';

// --- Resolvers ---
import { AllPatientsResolver, PatientsResolver } from '../_services';


const routes: Routes = [
  { path: '', component: PatientComponent, resolve: {
    patients: PatientsResolver,
    all: AllPatientsResolver
  }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PatientRoutingModule { }
