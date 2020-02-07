import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteDataComponent } from './delete-data.component';

const routes: Routes = [{ path: '', component: DeleteDataComponent, pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeleteDataRoutingModule { }
