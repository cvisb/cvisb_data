import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// --- Pages ---
import { HomeComponent } from './home/home.component';

// --- Admin stuff ---
import { LoginComponent } from './admin/login/login.component';
import { RedirectComponent } from './admin/redirect/redirect.component';
import { UnauthorizedComponent } from './admin/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './admin/page-not-found/page-not-found.component';
import { TermsComponent } from './admin/terms/terms.component';
import { PrivacyComponent } from './admin/privacy/privacy.component';
import { CitationComponent } from './admin/citation/citation.component';
import { AboutComponent } from './admin/about/about.component';
import { AboutDataComponent } from './admin/about-data/about-data.component';
import { SchemaComponent } from './schema/schema.component';
import { ReleaseNotesComponent } from './admin/release-notes/release-notes.component';

import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', data: { title: 'Login | CViSB' } },

  {
    path: 'patient', loadChildren: "./patient/patient.module#PatientModule", pathMatch: 'full'
  },
  { path: 'patient/:pid', loadChildren: './patient-page/patient-page.module#PatientPageModule', pathMatch: 'full', data: { titleStart: 'Patient ', titleEnd: ' | CViSB' } },

  { canActivate: [AuthGuard], path: 'upload/sample', loadChildren: './add-samples/upload-samples/upload-samples.module#UploadSamplesModule', pathMatch: 'full', data: { title: 'Upload Samples | CViSB' } },
  { canActivate: [AuthGuard], path: 'upload/patient', loadChildren: './add-patients/upload-patients/upload-patients.module#UploadPatientsModule', pathMatch: 'full', data: { title: 'Upload Patients | CViSB' } },
  { canActivate: [AuthGuard], path: 'upload/dataset', loadChildren: './add-data/upload-data/upload-data.module#UploadDataModule', pathMatch: 'full', data: { title: 'Upload Data | CViSB' } },
  { canActivate: [AuthGuard], path: 'upload', loadChildren: './upload/upload.module#UploadModule', pathMatch: 'full', data: { title: 'Upload Data | CViSB' } },
  {
    canActivate: [AuthGuard], path: 'sample', loadChildren: './sample/sample.module#SampleModule', pathMatch: 'full', data: { title: 'Samples | CViSB' }
  },
  // // { canActivate: [AuthGuard], path: 'sample/:sid', component: SampleOverviewComponent, pathMatch: 'full' },
  { path: 'dataset', loadChildren: './dataset/dataset.module#DatasetModule', pathMatch: 'full', data: { title: 'Data | CViSB' } },
  { path: 'dataset/hla', loadChildren: './hla/hla.module#HlaModule', pathMatch: 'full', data: { title: 'Data | CViSB', dsid: "hla" } },

  { path: 'documentation', component: AboutDataComponent, pathMatch: 'full', data: { title: 'Data | CViSB' } },
  { path: 'schema', component: SchemaComponent, pathMatch: 'full', data: { title: 'Schema | CViSB' } },
  { path: 'redirect', component: RedirectComponent, pathMatch: 'full', data: { title: 'Redirecting... | CViSB Data' } },
  { path: 'unauthorized', component: UnauthorizedComponent, pathMatch: 'full', data: { title: 'Unauthorized user | CViSB Data' } },
  { path: 'about', component: AboutComponent, pathMatch: 'full', data: { title: 'About | CViSB Data' } },
  { path: 'citation', component: CitationComponent, pathMatch: 'full', data: { title: 'Citing CViSB Data' } },
  { path: 'release-notes', component: ReleaseNotesComponent, pathMatch: 'full', data: { title: 'CViSB Data Releases' } },
  { path: 'terms', component: TermsComponent, pathMatch: 'full', data: { title: 'Terms of Use | CViSB Data' } },
  { path: 'privacy', component: PrivacyComponent, pathMatch: 'full', data: { title: 'Privacy | CViSB Data' } },
  { path: 'home', component: HomeComponent, pathMatch: 'full', data: { title: 'CViSB Data' } },
  { path: 'sitemap.xml', pathMatch: 'full', redirectTo: "/assets/sitemap.xml" },
  { path: 'robots.txt', pathMatch: 'full', redirectTo: "/assets/robots.txt" },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,
      { enableTracing: false, scrollPositionRestoration: 'enabled' } // <-- true = debugging purposes
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
