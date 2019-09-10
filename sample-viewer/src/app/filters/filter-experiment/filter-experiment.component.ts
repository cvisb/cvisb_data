import { Component, OnInit, Input } from '@angular/core';

// import { D3Nested } from '../../_models';
//
import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-filter-experiment',
  templateUrl: './filter-experiment.component.html',
  styleUrls: ['./filter-experiment.component.scss']
})
export class FilterExperimentComponent implements OnInit {
  @Input() endpoint: string;
  expts: any[];

  constructor(private requestSvc: RequestParametersService) { }

  ngOnInit() {
    this.expts = [
      { key: "hla", name: "HLA sequencing", disabled: true },
      { key: "viralseq", name: "viral sequencing", disabled: true },
      // { key: "systemsserology", name: "systems serology", disabled: true },
    ];

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

    let exptNames = this.expts.filter(d => !d.disabled).map(d => d.name);

    this.requestSvc.updateParams(this.endpoint, { field: "measurementTechnique", value: exptNames });
  }

  // Used to reset, when the filters are cleared.
  checkParams(params) {
    if (params.length === 0) {
      this.expts.forEach(d => d.disabled = true);
    }
  }

}
