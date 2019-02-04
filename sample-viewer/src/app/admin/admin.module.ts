import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { CitationComponent } from './citation/citation.component';
import { RedirectComponent } from './redirect/redirect.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AboutComponent, PrivacyComponent, TermsComponent, CitationComponent, RedirectComponent]
})
export class AdminModule { }
