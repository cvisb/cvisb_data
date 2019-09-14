import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- Components ---
import { SampleComponent } from './sample.component';

// --- Resolvers ---
import { SamplesResolver } from '../_services';

const routes: Routes = [
  {
    path: '', component: SampleComponent, pathMatch: 'full',
    resolve: {
      samplePatientMD: SamplesResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SampleRoutingModule { }
