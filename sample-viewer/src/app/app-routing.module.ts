import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// --- Pages ---
import { HomeComponent } from './home/home.component';
import { AddSamplesComponent } from './add-samples/add-samples.component';
import { SampleComponent } from './sample/sample.component';
import { AddPatientsComponent } from './add-patients/add-patients/add-patients.component';
import { AddDataComponent } from './add-data/add-data/add-data.component';
import { DatasetPageComponent } from './dataset-page/dataset-page.component';
import { SchemaComponent } from './schema/schema.component';
import { UploadComponent } from './upload/upload.component';
import { ReleaseNotesComponent } from './admin/release-notes/release-notes.component';

// --- Dataset pages ---
// import { HlaPageComponent } from './dataset-page/hla-page/hla-page.component';

// --- Resolvers ---
import { AllPatientsResolver, PatientsResolver, DatasetResolver, HlaResolver, SamplesResolver } from './_services';

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

import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', data: { title: 'Login | CViSB' } },

  {
    path: 'patient', loadChildren: () => import('./patient/patient.module').then(mod => mod.PatientModule), pathMatch: 'full'
  },
  { path: 'patient/:pid', loadChildren: () => import('./patient-page/patient-page.module').then(mod => mod.PatientPageModule), pathMatch: 'full', data: { titleStart: 'Patient ', titleEnd: ' | CViSB' } },

  // { canActivate: [AuthGuard], path: 'upload/sample', component: AddSamplesComponent, pathMatch: 'full', data: { title: 'Upload Samples | CViSB' } },
  // { canActivate: [AuthGuard], path: 'upload/patient', component: AddPatientsComponent, pathMatch: 'full', data: { title: 'Upload Patients | CViSB' } },
  // { canActivate: [AuthGuard], path: 'upload/dataset', component: AddDataComponent, pathMatch: 'full', data: { title: 'Upload Data | CViSB' } },
  // { canActivate: [AuthGuard], path: 'upload', component: UploadComponent, pathMatch: 'full', data: { title: 'Upload Data | CViSB' } },
  //
  // { canActivate: [AuthGuard], path: 'sample', component: SampleComponent, pathMatch: 'full', data: { title: 'Samples | CViSB' },
  //   resolve: {
  //     samplePatientMD: SamplesResolver,
  //   }
  // },
  // // { canActivate: [AuthGuard], path: 'sample/:sid', component: SampleOverviewComponent, pathMatch: 'full' },
  { path: 'dataset', loadChildren: () => import('./dataset/dataset.module').then(mod => mod.DatasetModule), pathMatch: 'full', data: { title: 'Data | CViSB' } },
  // // {
  // //   path: 'dataset/hla', component: DatasetPageComponent, pathMatch: 'full',
  // //   resolve: {
  // //     datasetData: DatasetResolver,
  // //     hlaSummary: HlaResolver
  // //   }, data: { title: 'Dataset | CViSB' }
  // // },
  // { path: 'dataset/:dsid', component: DatasetPageComponent, pathMatch: 'full', resolve: {
  //     datasetData: DatasetResolver,
  //     hlaSummary: HlaResolver
  //   }, data: { title: 'Dataset | CViSB' }
  // },
  // // {
  // //   path: 'dataset/:dsid', component: DatasetPageComponent, resolve: { datasetData: DatasetResolver },
  // //   pathMatch: 'full', data: { title: 'Dataset | CViSB' },
  // //   children: [{
  // //     path: 'hla', component: PageNotFoundComponent, outlet: 'datasets'
  // //   }]
  // // },
  // { path: 'documentation', component: AboutDataComponent, pathMatch: 'full', data: { title: 'Data | CViSB' } },
  // { path: 'schema', component: SchemaComponent, pathMatch: 'full', data: { title: 'Schema | CViSB' } },
  // { path: 'redirect', component: RedirectComponent, pathMatch: 'full', data: { title: 'Redirecting... | CViSB Data' } },
  // { path: 'unauthorized', component: UnauthorizedComponent, pathMatch: 'full', data: { title: 'Unauthorized user | CViSB Data' } },
  // { path: 'about', component: AboutComponent, pathMatch: 'full', data: { title: 'About | CViSB Data' } },
  // { path: 'citation', component: CitationComponent, pathMatch: 'full', data: { title: 'Citing CViSB Data' } },
  // { path: 'release-notes', component: ReleaseNotesComponent, pathMatch: 'full', data: { title: 'CViSB Data Releases' } },
  // { path: 'terms', component: TermsComponent, pathMatch: 'full', data: { title: 'Terms of Use | CViSB Data' } },
  // { path: 'privacy', component: PrivacyComponent, pathMatch: 'full', data: { title: 'Privacy | CViSB Data' } },
  { path: 'home', component: HomeComponent, pathMatch: 'full', data: { title: 'CViSB Data' } },
  { path: 'sitemap.xml', pathMatch: 'full', redirectTo: "../assets/sitemap.xml" },
  { path: 'robots.txt', pathMatch: 'full', redirectTo: "../assets/robots.txt" },
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
