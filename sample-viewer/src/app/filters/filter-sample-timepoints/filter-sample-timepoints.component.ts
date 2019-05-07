  import { Component, OnInit, Input } from '@angular/core';

  import { Observable, BehaviorSubject } from 'rxjs';

  import { FilterTimepointsService, RequestParametersService } from '../../_services';

  @Component({
    selector: 'app-filter-sample-timepoints',
    templateUrl: './filter-sample-timepoints.component.html',
    styleUrls: ['./filter-sample-timepoints.component.scss']
  })

  export class FilterSampleTimepointsComponent implements OnInit {
    @Input() endpoint: string;
    data;
    freqDomain: number[];
    filter_title: string = "Number of Timepoints";


    public filterSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>(null);
    public filterState$ = this.filterSubject.asObservable();


    // temp1.facets["privatePatientID.keyword"].terms.forEach(d => d["numTimepoints"] = d["visitCode.keyword"].terms.length)

    constructor(
      private filterSvc: FilterTimepointsService,
      private requestSvc: RequestParametersService
    ) {
    }

    ngOnInit() {
      this.filterSvc.summarizeTimepoints().subscribe(res => {
        console.log(res)
        this.data = res;
        this.freqDomain = res.map(d => d.term);
      });

      // this.filterHandler({term: 2})
    }

    filterHandler(params) {
      console.log("Calling filter handler in timepoints!")
      console.log(params)

      this.filterSvc.filterTimepoints(params.term, params.term).subscribe(patients => {
        let patientIDs = patients;

        console.log(patientIDs);

        this.requestSvc.updateParams(this.endpoint, { field: 'patientID', value: patientIDs });
      });
    }

  }
