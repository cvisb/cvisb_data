import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-patient-files',
  templateUrl: './patient-files.component.html',
  styleUrls: ['./patient-files.component.scss']
})
export class PatientFilesComponent implements OnInit {
  @Input() datadownload;

  constructor() { }

  ngOnInit() {
    console.log(this.datadownload)
  }

}
