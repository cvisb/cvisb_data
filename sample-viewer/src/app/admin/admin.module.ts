import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { CitationComponent } from './citation/citation.component';
import { RedirectComponent } from './redirect/redirect.component';
import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FundingComponent } from './funding/funding.component';
import { AboutDataComponent } from './about-data/about-data.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { ReleaseNotesComponent } from './release-notes/release-notes.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  declarations: [
    AboutComponent,
    PrivacyComponent,
    TermsComponent,
    CitationComponent,
    RedirectComponent,
    LoginComponent,
    UnauthorizedComponent,
    PageNotFoundComponent,
    FundingComponent,
    AboutDataComponent,
    DisclaimerComponent,
    ReleaseNotesComponent,],
})
export class AdminModule { }
