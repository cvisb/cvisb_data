import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { HttpParams } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { faDna, faTable, faUsers } from '@fortawesome/free-solid-svg-icons';

import { ApiService, GetDatacatalogService, GetExperimentsService } from '../_services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  patientCount: number;
  sampleCount: number;
  experimentCount: Object[] = [];
  cvisbCatalog$: Observable<Object>;
  faDna = faDna;
  faTable = faTable;
  faUsers = faUsers;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleSvc: Title,
    private route: ActivatedRoute,
    private dataCatalogSvc: GetDatacatalogService,
    private exptSvc: GetExperimentsService,
    public apiSvc: ApiService) {
    this.cvisbCatalog$ = this.dataCatalogSvc.dataCatalog$;;

    // set page title
    let title = environment.production ? this.route.snapshot.data.title : 'DEV:' + this.route.snapshot.data.title;
    this.titleSvc.setTitle(title);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getSummaryCounts().subscribe(_ => {
      });
    }
  }

  getSummaryCounts() {
    let patientParams = new HttpParams().set("q", "__all__");

    return forkJoin(this.apiSvc.get("patient", patientParams, 0), this.apiSvc.get("sample", patientParams, 0), this.exptSvc.getExptCounts())
      .pipe(
        map(([patients, samples, expts]) => {
          // patients
          this.patientCount = patients['total'].toLocaleString();

          // Samples
          this.sampleCount = samples['total'].toLocaleString();

          // experiments
          this.experimentCount = expts;

          console.log(expts)
        })
      );
  }

}
