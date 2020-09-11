import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryStatsComponent } from './summary-stats.component';

const routes: Routes = [
  { path: '', component: SummaryStatsComponent, pathMatch: 'full', data: { title: 'Summary Statistics | CViSB' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryStatsRoutingModule { }
