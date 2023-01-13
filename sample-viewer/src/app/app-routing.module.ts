import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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
// import { TestComponent } from './test/test.component';

import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', data: { title: 'Login | CViSB' } },

  { path: 'patient', loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule), pathMatch: 'full' },
  { path: 'patient/:pid', loadChildren: () => import('./patient-page/patient-page.module').then(m => m.PatientPageModule), pathMatch: 'full', data: { titleStart: 'Patient ', titleEnd: ' | CViSB' } },

  { canActivate: [AuthGuard], path: 'upload/sample', loadChildren: () => import('./add-samples/upload-samples/upload-samples.module').then(m => m.UploadSamplesModule), pathMatch: 'full', data: { title: 'Upload Samples | CViSB' } },
  { canActivate: [AuthGuard], path: 'upload/patient', loadChildren: () => import('./add-patients/upload-patients/upload-patients.module').then(m => m.UploadPatientsModule), pathMatch: 'full', data: { title: 'Upload Patients | CViSB' } },
  { canActivate: [AuthGuard], path: 'upload/dataset', loadChildren: () => import('./add-data/upload-data/upload-data.module').then(m => m.UploadDataModule), pathMatch: 'full', data: { title: 'Upload Data | CViSB' } },
  { path: 'upload/catalog', loadChildren: () => import('./add-catalog/add-catalog.module').then(m => m.AddCatalogModule), pathMatch: 'full', data: { title: 'Upload Data Catalog | CViSB' } },
  { canActivate: [AuthGuard], path: 'upload/delete', loadChildren: () => import('./delete-data/delete-data.module').then(m => m.DeleteDataModule), pathMatch: 'full', data: { title: 'Upload Data | CViSB' } },
  { canActivate: [AuthGuard], path: 'upload', loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule), pathMatch: 'full', data: { title: 'Upload Data | CViSB' } },
  { canActivate: [AuthGuard], path: 'sample', loadChildren: () => import('./sample/sample.module').then(m => m.SampleModule), pathMatch: 'full', data: { title: 'Samples | CViSB' } },

  // { path: 'epi', pathMatch: 'full', redirectTo: "/epidemiology" },
  // { path: 'epidemiology', loadChildren: () => import('./epidemiology/epidemiology.module').then(m => m.EpidemiologyModule), pathMatch: 'full', data: { title: 'Epidemiology | CViSB' } },
  { canActivate: [AuthGuard], path: 'data-quality', loadChildren: () => import('./data-quality/data-quality.module').then(m => m.DataQualityModule), pathMatch: 'full', data: { title: 'Data Quality | CViSB' } },
  // // { canActivate: [AuthGuard], path: 'sample/:sid', component: SampleOverviewComponent, pathMatch: 'full' },
  { path: 'dataset/hla', loadChildren: () => import('./hla/hla.module').then(m => m.HlaModule), pathMatch: 'full', data: { title: 'Data | CViSB', dsid: "hla" } },
  { path: 'dataset/viralseq', pathMatch: 'full', redirectTo: "/dataset/lassa-virus-seq" },
  { path: 'dataset/viral-seq', pathMatch: 'full', redirectTo: "/dataset/lassa-virus-seq" },
  { path: 'dataset/lassa-viral-seq', pathMatch: 'full', redirectTo: "/dataset/lassa-virus-seq" },
  { path: 'dataset/ebola-viral-seq', pathMatch: 'full', redirectTo: "/dataset/ebola-virus-seq" },
  { path: 'dataset/sarscov2-viral-seq', pathMatch: 'full', redirectTo: "/dataset/sarscov2-virus-seq" },
  { path: 'dataset/lassa-epi-2023', loadChildren: () => import('./peer-dataset/peer-dataset.module').then(m => m.PeerDatasetModule), pathMatch: 'full', data: { title: 'PEER Data' } },
  { path: 'dataset/CViSB-SystemsSerology.csv', loadChildren: () => import('./download-data/download-data.module').then(m => m.DownloadDataModule), pathMatch: 'full', data: { title: 'Data | CViSB', dsid: "systems-serology" } },
  { path: 'dataset/:dsid', loadChildren: () => import('./dataset-page-generic/dataset-page-generic.module').then(m => m.DatasetPageGenericModule), pathMatch: 'full' },
  { path: 'dataset', loadChildren: () => import('./dataset/dataset.module').then(m => m.DatasetModule), pathMatch: 'full', data: { title: 'Data | CViSB' } },
  // { path: 'summary-stats', loadChildren: () => import('./summary-stats/summary-stats.module').then(m => m.SummaryStatsModule), pathMatch: 'full', data: { title: 'Summary Statistics | CViSB' } },

  { path: 'download/:id', loadChildren: () => import('./download/download.module').then(m => m.DownloadModule), pathMatch: 'full' },
  { path: 'download', loadChildren: () => import('./download-expts/download-expts.module').then(m => m.DownloadExptsModule), pathMatch: 'full' },

  { path: 'documentation', component: AboutDataComponent, pathMatch: 'full', data: { title: 'Data | CViSB' } },
  { path: 'schema', component: SchemaComponent, pathMatch: 'full', data: { title: 'Schema | CViSB' } },
  { path: 'software', loadChildren: () => import('./software/software.module').then(m => m.SoftwareModule), pathMatch: 'full', data: { title: 'Software | CViSB' } },
  { path: 'redirect', component: RedirectComponent, pathMatch: 'full', data: { title: 'Redirecting... | CViSB Data' } },
  { path: 'unauthorized', component: UnauthorizedComponent, pathMatch: 'full', data: { title: 'Unauthorized user | CViSB Data' } },
  { path: 'about', component: AboutComponent, pathMatch: 'full', data: { title: 'About | CViSB Data' } },
  { path: 'citation', component: CitationComponent, pathMatch: 'full', data: { title: 'Citing CViSB Data' } },
  { path: 'release-notes', component: ReleaseNotesComponent, pathMatch: 'full', data: { title: 'CViSB Data Releases' } },
  { path: 'terms', component: TermsComponent, pathMatch: 'full', data: { title: 'Terms of Use | CViSB Data' } },
  { path: 'privacy', component: PrivacyComponent, pathMatch: 'full', data: { title: 'Privacy | CViSB Data' } },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), pathMatch: 'full', data: { title: 'CViSB Data' } },
  { path: 'assets/sitemap.xml', pathMatch: 'full', redirectTo: "/sitemap.xml" },
  { path: 'assets/robots.txt', pathMatch: 'full', redirectTo: "/robots.txt" },
  // { path: 'test', pathMatch: 'full', component: TestComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { enableTracing: false, scrollPositionRestoration: 'enabled', initialNavigation: 'enabled', relativeLinkResolution: 'legacy' } // <-- true = debugging purposes
 // <-- true = debugging purposes
)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
