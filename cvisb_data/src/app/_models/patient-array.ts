import { Patient } from './patient';
import { D3Nested } from './d3-nested';

import * as d3 from 'd3';

export class PatientArray {
  patients: Patient[];
  patientIDs: string[];
  relatedIDs: string[];
  patientTypes: D3Nested[];
  patientOutcomes: D3Nested[];
  patientCountries: D3Nested[];
  patientYears: D3Nested[];
  exptTypes: D3Nested[];

  constructor(patients: Patient[]) {
    this.patients = patients;

    this.patientIDs = patients.map((d: Patient) => d.patientID);
    // this.relatedIDs = patients.map((d:Patient) => d.relatedTo);

    this.patientTypes = d3.nest().key((d: Patient) => d.cohort).rollup((values: any) => values.length).entries(patients);
    this.patientOutcomes = d3.nest().key((d: Patient) => d.outcome).rollup((values: any) => values.length).entries(patients);
    this.patientYears = d3.nest().key((d: any) => String(new Date(d.infectionDate).getFullYear())).rollup((values: any) => values.length).entries(patients);

    // --- years ---
    // convert year key from string to number.
    this.patientYears.forEach(d => {
      d.key = isNaN(+d.key) ? 'unknown' : +d.key;
    })

    // --- countries ---
    // Convert unknown countries to unknowns
    patients.forEach((d: Patient) => {
      d.country = d.country ? d.country : { identifier: "unknown", name: "unknown" }
    });

    this.patientCountries = d3.nest()
      .key((d: Patient) => d.country['identifier'])
      .key((d: Patient) => d.country['name'])
      .rollup((values: any) => values.length)
      .entries(patients);

    for (let country of this.patientCountries) {
      country.value = country.values[0].value;
      country.name = country.values[0].key;
    }

    // --- experiments ---
    this.exptTypes = [];
    let expts: any = patients.filter((d: Patient) => d.availableData).map((d: Patient) => d.availableData);
    expts = expts.flat();

    for (let expt of expts) {
      let id = expt['identifier'];
      let idx = this.exptTypes.findIndex(d => d.key === id);
      if (idx >= 0) {
        this.exptTypes[idx]['value'] = <number>this.exptTypes[idx]['value'] + 1;
      } else {
        this.exptTypes.push({ key: expt['identifier'], value: 1, name: expt['name'] })
      }
    }

    this.exptTypes.sort((a: any, b: any) => b.value - a.value);

  }
}
