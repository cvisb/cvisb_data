import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- components ---
import { HlaPageComponent } from './hla-page.component'

// --- resolvers ---
import { DatasetResolver } from '../_services/get-datasets.resolver';
import { HlaResolver } from '../_services/hla.resolver';

const routes: Routes = [
  { path: '', component: HlaPageComponent, pathMatch: 'full', resolve: {
        datasetData: DatasetResolver,
        hlaSummary: HlaResolver
  }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HlaRoutingModule { }
