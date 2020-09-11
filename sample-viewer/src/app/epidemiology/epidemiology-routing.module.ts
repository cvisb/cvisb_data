import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EpidemiologyComponent } from './epidemiology.component';

const routes: Routes = [
  { path: '', component: EpidemiologyComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EpidemiologyRoutingModule { }
