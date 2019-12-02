import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadDataComponent } from './download-data.component';


const routes: Routes = [
  { path: '', component: DownloadDataComponent, pathMatch: 'full', data: { title: 'Dataset | CViSB' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadDataRoutingModule { }
