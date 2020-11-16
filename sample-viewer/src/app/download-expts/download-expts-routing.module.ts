import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadExptsComponent } from "./download-expts.component";

const routes: Routes = [{
  path: '', component: DownloadExptsComponent, pathMatch: 'full', data: { title: 'Download Dataset | CViSB' } 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadExptsRoutingModule { }
