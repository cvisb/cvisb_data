import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsPopupComponent } from './terms-popup.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [ TermsPopupComponent ],
  entryComponents: [ TermsPopupComponent ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class TermsPopupModule { }
