import { Component, OnChanges, Input } from '@angular/core';

import { Patient, D3Nested } from '../../_models';

import { MatTableDataSource } from '@angular/material';

import { nest } from 'd3';

@Component({
  selector: 'app-patient-elisas',
  templateUrl: './patient-elisas.component.html',
  styleUrls: ['./patient-elisas.component.scss']
})

export class PatientElisasComponent implements OnChanges {
  @Input() patient: Patient;
  elisa_table: D3Nested[];
  test_types: string[] = ["IgG", "IgM", "Ag"];

  elisaSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["virus"].concat(this.test_types).concat(["timepoint"]);


  constructor() { }

  ngOnChanges() {
    if (this.patient.elisa) {
      this.elisa_table = nest()
        .key((d: any) => d.virus) // sort by key
        .rollup(function(d: any) { // do this to each grouping
          // reduce takes a list and returns one value
          // in this case, the list is all the grouped elements
          // and the final value is an object with keys
          return d.reduce(function(prev, curr) {
            prev["virus"] = curr["virus"];
            // If it already exists-- Append
            // If not-- create it as an Array
            // Used as a safeguard in case there's duplicate ELISA data.
            prev[curr["assayType"]] ? prev[curr["assayType"]].push(curr["ELISAresult"]) : prev[curr["assayType"]] = [curr["ELISAresult"]];
            return prev;
          }, {});
        })
        .entries(this.patient.elisa) // tell it what data to process
        .map((d: any) => d.value);

        console.log(this.elisa_table)
      console.log(nest()
        .key((d: any) => d.virus) // sort by key
        .key((d: any) => d.timepoint) // sort by key
        .rollup(function(d: any) { // do this to each grouping
          // reduce takes a list and returns one value
          // in this case, the list is all the grouped elements
          // and the final value is an object with keys
          return d.reduce(function(prev, curr) {
            prev["virus"] = curr["virus"];
            // If it already exists-- Append
            // If not-- create it as an Array
            // Used as a safeguard in case there's duplicate ELISA data.
            prev[curr["assayType"]] ? prev[curr["assayType"]].push(curr["ELISAresult"]) : prev[curr["assayType"]] = [curr["ELISAresult"]];
            return prev;
          }, {});
        })
        .entries(this.patient.elisa) // tell it what data to process
        .map((d: any) => d.value));


      this.elisaSource = new MatTableDataSource(this.elisa_table);
    }
  }


}
