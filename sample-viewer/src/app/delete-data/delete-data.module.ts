import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteDataRoutingModule } from './delete-data-routing.module';
import { DeleteDataComponent } from './delete-data.component';

import { MatSelectModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [DeleteDataComponent],
  imports: [
    CommonModule,
    DeleteDataRoutingModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class DeleteDataModule { }
