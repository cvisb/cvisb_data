import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteDataRoutingModule } from './delete-data-routing.module';
import { DeleteDataComponent } from './delete-data.component';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [DeleteDataComponent],
  imports: [
    CommonModule,
    DeleteDataRoutingModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class DeleteDataModule { }
