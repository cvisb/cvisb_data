import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// --- Pages ---
import { HomeComponent } from './home/home.component';
import { AddSamplesComponent } from './add-samples/add-samples.component';
import { SampleComponent } from './sample/sample.component';
import { PatientComponent } from './patient/patient.component';
import { PatientPageComponent } from './patient-page/patient-page.component';
import { DatasetComponent } from './dataset/dataset.component';
import { DatasetPageComponent } from './dataset-page/dataset-page.component';
import { SchemaComponent } from './schema/schema.component';

// --- Admin stuff ---
import { LoginComponent } from './admin/login/login.component';
import { RedirectComponent } from './admin/redirect/redirect.component';
import { UnauthorizedComponent } from './admin/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './admin/page-not-found/page-not-found.component';
import { TermsComponent } from './admin/terms/terms.component';
import { PrivacyComponent } from './admin/privacy/privacy.component';
import { CitationComponent } from './admin/citation/citation.component';
import { AboutComponent } from './admin/about/about.component';

import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', data: { title: 'Login | CViSB' } },
  { canActivate: [AuthGuard], path: 'patient', component: PatientComponent, pathMatch: 'full', data: { title: 'Patients | CViSB' } },
  { canActivate: [AuthGuard], path: 'patient/:pid', component: PatientPageComponent, pathMatch: 'full', data: { titleStart: 'Patient ', titleEnd: ' | CViSB' } },
  { canActivate: [AuthGuard], path: 'sample', component: SampleComponent, pathMatch: 'full', data: { title: 'Samples | CViSB' } },
  // { canActivate: [AuthGuard], path: 'sample/:sid', component: SampleOverviewComponent, pathMatch: 'full' },
  { canActivate: [AuthGuard], path: 'sample/upload', component: AddSamplesComponent, pathMatch: 'full', data: { title: 'Add Samples | CViSB' } },
  { path: 'dataset', component: DatasetComponent, pathMatch: 'full', data: { title: 'Data | CViSB' } },
  { path: 'dataset/:dsid', component: DatasetPageComponent, pathMatch: 'full', data: { title: 'Dataset | CViSB' } },
  { path: 'schema', component: SchemaComponent, pathMatch: 'full', data: { title: 'Schema | CViSB' } },
  { path: 'redirect', component: RedirectComponent, pathMatch: 'full', data: { title: 'Redirecting... | CViSB Data' } },
  { path: 'unauthorized', component: UnauthorizedComponent, pathMatch: 'full', data: { title: 'Unauthorized user | CViSB Data' } },
  { path: 'about', component: AboutComponent, pathMatch: 'full', data: { title: 'About | CViSB Data' } },
  { path: 'citation', component: CitationComponent, pathMatch: 'full', data: { title: 'Citing CViSB Data' } },
  { path: 'terms', component: TermsComponent, pathMatch: 'full', data: { title: 'Terms of Use | CViSB Data' } },
  { path: 'privacy', component: PrivacyComponent, pathMatch: 'full', data: { title: 'Privacy | CViSB Data' } },
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent, pathMatch: 'full', data: { title: 'CViSB Data' } },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,
      { enableTracing: false } // <-- true = debugging purposes
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
