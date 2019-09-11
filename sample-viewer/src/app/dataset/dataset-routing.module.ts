import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatasetComponent } from './dataset.component';

const routes: Routes = [
  { path: '', component: DatasetComponent, pathMatch: 'full', data: { title: 'Dataset | CViSB' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatasetRoutingModule { }
