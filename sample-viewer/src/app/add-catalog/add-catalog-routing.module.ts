import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateCatalogComponent } from "./update-catalog/update-catalog.component";

const routes: Routes = [{ path: '', component: UpdateCatalogComponent, pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCatalogRoutingModule { }
