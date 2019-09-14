import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPatientsComponent } from '../add-patients/add-patients.component';

const routes: Routes = [{ path: '', component: AddPatientsComponent, pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadPatientsRoutingModule { }
