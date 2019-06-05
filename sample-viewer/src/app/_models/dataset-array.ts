import { D3Nested } from './d3-nested';

import * as d3 from 'd3';

export class DatasetArray {
  patientIDs: string[];
  relatedIDs: string[];
  patientTypes: D3Nested[];
  patientOutcomes: D3Nested[];
  patientCountries: Object[];
  patientYears: D3Nested[];
  exptTypes: D3Nested[];

  constructor(datasets: any) {

    this.patientTypes = [
      { key: "Control", value: 117 },
      { key: "Ebola", value: 49 },
      { key: "Lassa", value: 87 }
    ];

    this.patientOutcomes = [
      { key: "Control", value: 117 },
      { key: "Dead", value: 21 },
      { key: "Survivor", value: 109 },
      { key: "Unknown", value: 6 }
    ];

    this.patientYears = [
      { 'key': 2014, 'value': 190 },
      { 'key': 2015, 'value': 93 },
      { 'key': 2016, 'value': 432 },
      { 'key': 2017, 'value': 220 },
      { 'key': 2018, 'value': 19 },
      { 'key': 'unknown', 'value': 1090 }
    ];

    this.patientCountries = [
      { key: 'SL', name: 'Sierra Leone', value: 255 },
      { key: 'NG', name: 'Nigeria', value: 14 },
      { key: 'unknown', value: 0 }
    ]

    // manual copy/paste from Karthik's file
    this.patientIDs = [
    ];


    // --- experiments ---
    this.exptTypes = [];

    // for (let dataset of datasets) {
    //   this.exptTypes.push({ key: dataset.identifier, name: (dataset.alternateName || dataset.name), value: dataset.distribution.length })
    // }

    this.exptTypes.sort((a: any, b: any) => b.value - a.value);

  }
}
