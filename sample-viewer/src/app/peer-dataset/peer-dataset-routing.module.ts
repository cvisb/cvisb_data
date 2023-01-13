import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeerDatasetComponent } from './peer-dataset.component';

const routes: Routes = [
  { path: '', component: PeerDatasetComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerDatasetRoutingModule { }
