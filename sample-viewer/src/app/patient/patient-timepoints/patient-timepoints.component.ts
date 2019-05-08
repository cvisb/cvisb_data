import { Component, OnInit, Input } from '@angular/core';

import { Sample } from '../../_models';

import { ApiService } from '../../_services';

@Component({
  selector: 'app-patient-timepoints',
  templateUrl: './patient-timepoints.component.html',
  styleUrls: ['./patient-timepoints.component.scss']
})

export class PatientTimepointsComponent implements OnInit {
  @Input() alternateIDs: string[];
  private samples: Object[] = [];

  constructor(private apiSvc: ApiService) { }

  ngOnInit() {
    console.log(this.alternateIDs);

    this.alternateIDs.forEach(id => {
      this.apiSvc.getOne('sample', id, 'privatePatientID').subscribe(res => {
        console.log(res);
        this.samples = this.samples.concat(res);
      })
    })
    console.log(this.samples)

    this.samples = [{"visitCode": "1", "sampleType": "viralRNA"}, {"visitCode": "1", "sampleType": "PBMC"},{"visitCode": "2", "sampleType": "viralRNA"},{"visitCode": "1", "sampleType": "DNA"}];

  }

}
