import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteDataRoutingModule } from './delete-data-routing.module';
import { DeleteDataComponent } from './delete-data.component';

import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [DeleteDataComponent],
  imports: [
    CommonModule,
    DeleteDataRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class DeleteDataModule { }
