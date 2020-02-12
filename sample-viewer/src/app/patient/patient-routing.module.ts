import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- Components ---
import { PatientComponent } from './patient.component';

// --- Resolvers ---
import { PatientsResolver } from '../_services';

const routes: Routes = [
  {
    path: '', component: PatientComponent, pathMatch: 'full', data: { title: 'Patients | CViSB' }, resolve: {
      patients: PatientsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PatientRoutingModule { }
