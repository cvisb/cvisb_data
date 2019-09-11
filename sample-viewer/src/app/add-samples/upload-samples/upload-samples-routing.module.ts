import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSamplesComponent } from '../add-samples.component';

const routes: Routes = [{ path: '', component: AddSamplesComponent, pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadSamplesRoutingModule { }
