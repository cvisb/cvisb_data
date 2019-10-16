import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- components ---
import { SerologyComponent } from './serology.component';

// --- resolvers ---
import { DatasetResolver } from '../_services/get-datasets.resolver';


const routes: Routes = [
  {
    path: '', component: SerologyComponent, pathMatch: 'full', resolve: {
      datasetData: DatasetResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SerologyRoutingModule { }
