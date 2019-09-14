import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- components ---
import { ViralSequencingComponent } from './viral-sequencing.component';

// --- resolvers ---
import { DatasetResolver } from '../_services/get-datasets.resolver';


const routes: Routes = [
  {
    path: '', component: ViralSequencingComponent, pathMatch: 'full', resolve: {
      datasetData: DatasetResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViralSequencingRoutingModule { }
