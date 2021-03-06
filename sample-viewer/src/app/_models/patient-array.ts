import { Patient } from './patient';
import { D3Nested } from './d3-nested';

import * as d3 from 'd3';
import { cloneDeep, flattenDeep } from 'lodash';

export class PatientArray {
  patients: Patient[];
  downloadable: any[];
  patientIDs: string[];
  relatedIDs: string[];
  patientTypes: D3Nested[];
  patientOutcomes: D3Nested[];
  patientCountries: D3Nested[];
  patientYears: D3Nested[];
  exptTypes: D3Nested[];

  constructor(patients: Patient[]) {
    if (patients.length > 0) {

      this.patientIDs = patients.map((d: Patient) => d.patientID);
      // this.relatedIDs = patients.map((d:Patient) => d.relatedTo);

      this.patientTypes = d3.nest().key((d: Patient) => d.cohort).rollup((values: any) => values.length).entries(patients);
      this.patientOutcomes = d3.nest().key((d: Patient) => d.outcome).rollup((values: any) => values.length).entries(patients);
      this.patientYears = d3.nest().key((d: any) => d.infectionYear).rollup((values: any) => values.length).entries(patients);

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
      if (Object.keys(patients).includes("availableData")) {
        let expts: any = patients.filter((d: Patient) => d.availableData).map((d: Patient) => d.availableData);
        expts = flattenDeep(expts);

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

      // Save patients, downloadable version
      this.patients = patients;

      // --- Downloadable version ---
      // Create a copy, so I don't modify the orignal
      this.downloadable = cloneDeep(patients);

      // Un-nest objects
      this.downloadable.forEach((d: Patient) => {
        d.country = d.country ? d.country['name'] : "unknown";
        d.availableData = d.availableData ? d.availableData.map((data_type: any) => data_type.name) : [];

        if (d.homeLocation) {
          d.homeLocation.forEach((adminUnit) => {
            d[`${adminUnit['administrativeType']}_home`] = adminUnit['name'];
          });
          delete d.homeLocation;
        }
        if (d.exposureLocation) {
          d.exposureLocation.forEach((adminUnit) => {
            d[`${adminUnit['administrativeType']}_exposure`] = adminUnit['name'];
          });
          delete d.exposureLocation;
        }
        if (d.elisa) {
          delete d.elisa;
        }
      });

    } else {
      this.patients = [];
      this.downloadable = [];
      this.patientIDs = [];
      this.relatedIDs = [];
      this.patientTypes = [];
      this.patientOutcomes = [];
      this.patientCountries = [];
      this.patientYears = [];
      this.exptTypes = [];
    }
  }
}
