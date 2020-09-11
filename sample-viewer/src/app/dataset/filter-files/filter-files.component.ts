import { Component, OnInit, Input } from '@angular/core';

import { FileMetadataService, RequestParametersService } from '../../_services';
import { DatasetArray } from '../../_models';

@Component({
  selector: 'app-filter-files',
  templateUrl: './filter-files.component.html',
  styleUrls: ['./filter-files.component.scss']
})

export class FilterFilesComponent implements OnInit {
  @Input() datasets: any;
  anything_selected: boolean;
  datasetSummary: DatasetArray;
  searchQuery: string = "";
  all_cohorts: string[] = ["Lassa", "Ebola", "Control", "Unknown"];

  constructor(
    private mdSvc: FileMetadataService,
    private requestSvc: RequestParametersService) {
    mdSvc.fileClicked$.subscribe(status => {
      this.anything_selected = status;
    })
  }

  ngOnInit() {
      this.datasetSummary = new DatasetArray(this.datasets);
      console.log(this.datasetSummary.patientOutcomes)
  }

  changeOutcomes() {
    this.datasetSummary.patientOutcomes = [{key: "Control", value: Math.random()}, {key: "Survivor", value: Math.random()}, {key: "Unknown", value: Math.random()}]
    this.datasetSummary.patientTypes = []
    if(Math.random() > 0.5) {
      this.datasetSummary.patientTypes.push({key: "Control", value: Math.random()});
    }
    if(Math.random() > 0.25) {
      this.datasetSummary.patientTypes.push({key: "Lassa", value: Math.random()})
    }
    if(Math.random() > 0.75) {
      this.datasetSummary.patientTypes.push({key: "Ebola", value: Math.random()})
    }
    //
  //   this.datasetSummary.patientTypes = [
  //   {
  //     id: 1,
  //     name: 'A',
  //     x: Math.random() * 100,
  //     y: Math.random() * 100
  //   },{
  //     id: 2,
  //     name: 'B',
  //     x: Math.random() * 100,
  //     y: Math.random() * 100
  //   },{
  //     id: 3,
  //     name: 'C',
  //     x: Math.random() * 100,
  //     y: Math.random() * 100
  //   }
  // ];
  }

  clearFilters() {
    this.searchQuery = "hello"
    this.requestSvc.patientParamsSubject.next([]);
  }

}
