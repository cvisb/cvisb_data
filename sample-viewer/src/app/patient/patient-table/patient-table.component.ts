import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { GetPatientsService } from '../../_services/';
import { Patient, PatientArray } from '../../_models';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent implements OnInit {
  // private patients: PatientArray;
  // private patientSummary: PatientArray;
  patientSource: MatTableDataSource<Patient>;
  selectedPatient;

  displayedColumns: string[] = ['patientID', 'alternateIdentifier', 'associatedSamples', 'cohort', 'outcome', 'country', 'age', 'gender', 'relatedTo', 'availableData'];

  // MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private patientSvc: GetPatientsService,
  ) {

    // grab the data
    this.patientSvc.patientsState$.subscribe((pList: PatientArray) => {
      this.patientSource = new MatTableDataSource(pList.patients);
    })

  }

  ngOnInit() {
    this.patientSource.paginator = this.paginator;

    // custom sorters for nested objects
    // Note: it seems to be working without this on a small sample size, but good to be explicit.
    this.patientSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'associatedSamples': return item.associatedSamples ? item.associatedSamples.length : 0;
        case 'country': return item.country['name'];
        case 'availableData': return item.availableData ? item.availableData.length : 0;
        default: return item[property];
      }
    };

    this.patientSource.sort = this.sort;
  }

  selectRow($event, row) {
    // $event.preventDefault();
    // $event.stopPropagation();  // <- that will stop propagation on lower layers

    // this.selectedPatient = row;
    this.router.navigate(['/patient', row.patientID]);
  }

}
