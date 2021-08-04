import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- components ---
import { DatasetPageGenericComponent } from './dataset-page-generic.component';

// --- resolvers ---
import { DatasetResolver } from '../_services/get-datasets.resolver';


const routes: Routes = [
  {
    path: '', component: DatasetPageGenericComponent, pathMatch: 'full', resolve: {
      datasetData: DatasetResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatasetPageGenericRoutingModule { }
