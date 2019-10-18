import { Component, OnInit, Input } from '@angular/core';

// import { D3Nested } from '../../_models';
//
import { GetExperimentsService, RequestParametersService } from '../../_services';
import { ExperimentObjectPipe } from '../../_pipes';

@Component({
  selector: 'app-filter-experiment',
  templateUrl: './filter-experiment.component.html',
  styleUrls: ['./filter-experiment.component.scss']
})
export class FilterExperimentComponent implements OnInit {
  @Input() endpoint: string;
  expts: any[];

  constructor(
    private exptSvc: GetExperimentsService,
    private exptPipe: ExperimentObjectPipe,
    private requestSvc: RequestParametersService
  ) { }

  ngOnInit() {

    this.exptSvc.getExptCounts().subscribe(expts => {
      this.expts = expts;
      this.expts.forEach(d => {
        d['disabled'] = true;
        let filtered = this.exptPipe.transform(d['term'], 'includedInDataset');
        d['dataset_name'] = filtered['dataset_name'];
      })
      console.log(this.expts)
    })
    // this.expts = [
    //   { key: "hla", name: "HLA sequencing", disabled: true },
    //   { key: "viralseq", name: "viral sequencing", disabled: true },
    //   // { key: "systemsserology", name: "systems serology", disabled: true },
    // ];

    switch (this.endpoint) {
      case "patient":
        this.requestSvc.patientParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;

      case "sample":
        this.requestSvc.sampleParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;
    }
  }

  filterExpt(idx) {
    this.expts[idx].disabled = !this.expts[idx].disabled;

    let exptNames = this.expts.filter(d => !d.disabled).map(d => d.term);

    this.requestSvc.updateParams(this.endpoint, { field: "includedInDataset", value: exptNames });
  }

  // Used to reset, when the filters are cleared.
  checkParams(params) {
    if (params.length === 0) {
      this.expts.forEach(d => d.disabled = true);
    }
  }

}
