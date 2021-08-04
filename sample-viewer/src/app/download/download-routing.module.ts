import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadComponent } from "./download.component";

const routes: Routes = [
  { path: '', component: DownloadComponent, pathMatch: 'full', data: { title: 'Download Dataset | CViSB' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadRoutingModule { }
