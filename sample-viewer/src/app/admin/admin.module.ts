import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- modules ---
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RouterModule } from '@angular/router';
import { FormatCitationModule } from '../format-citation/format-citation.module';
import { FormatPublisherModule } from '../format-publisher/format-publisher.module';

// --- components ---
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
import { DataTermsComponent } from './data-terms/data-terms.component';
import { SpinnerPopupComponent } from '../_dialogs/spinner-popup/spinner-popup.component';

import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { TermsPopupComponent } from '../_dialogs/terms-popup/terms-popup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    FormatCitationModule,
    FormatPublisherModule,
    SvgIconModule
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
    ReleaseNotesComponent,
    DataTermsComponent,
    SpinnerPopupComponent,
    TermsPopupComponent
  ]
})
export class AdminModule { }
