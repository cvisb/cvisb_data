import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { CitationComponent } from './citation/citation.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AboutComponent, PrivacyComponent, TermsComponent, CitationComponent]
})
export class AdminModule { }
