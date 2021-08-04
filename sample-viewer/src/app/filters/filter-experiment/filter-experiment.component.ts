import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { GetExperimentsService, RequestParametersService } from '../../_services';

import { ExperimentCount } from '../../_models/';

@Component({
  selector: 'app-filter-experiment',
  templateUrl: './filter-experiment.component.html',
  styleUrls: ['./filter-experiment.component.scss']
})
export class FilterExperimentComponent implements OnInit, OnDestroy {
  @Input() endpoint: string;
  @Input() expts: ExperimentCount[];
  patientSubscription: Subscription;
  sampleSubscription: Subscription;

  constructor(
    private exptSvc: GetExperimentsService,
    private requestSvc: RequestParametersService
  ) { }

  ngOnInit() {
    if (this.expts && this.expts.length > 0) {
      this.expts.forEach(d => {
        d['disabled'] = true;
      })
    }

    switch (this.endpoint) {
      case "patient":
        this.patientSubscription = this.requestSvc.patientParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;

      case "sample":
        this.sampleSubscription = this.requestSvc.sampleParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;
    }
  }

  ngOnDestroy() {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.sampleSubscription) {
      this.sampleSubscription.unsubscribe();
    }
  }


  filterExpt(idx: number) {
    this.expts[idx].disabled = !this.expts[idx].disabled;

    let exptNames = this.expts.filter(d => !d.disabled).map(d => d.term);

    this.requestSvc.updateParams(this.endpoint, { field: "includedInDataset.keyword", value: exptNames });
  }

  // Used to reset, when the filters are cleared.
  checkParams(params: Object[]) {
    if (params.length === 0 && this.expts && this.expts.length > 0) {
      this.expts.forEach(d => d.disabled = true);
    }
  }

}
