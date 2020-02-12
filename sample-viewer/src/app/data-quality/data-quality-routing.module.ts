import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataQualityComponent } from './data-quality.component';

const routes: Routes = [
    { path: '', component: DataQualityComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DataQualityRoutingModule { }
