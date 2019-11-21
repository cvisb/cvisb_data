import { DateRangePipe } from "../_pipes/date-range.pipe";
import { Organization } from './organization';
import { Citation } from './citation';

export class SystemsSerology {
  author: Organization;
  batchID: string;
  citation: Citation[];
  correction: string;
  data: SerologyData[];
  dataStatus: string;
  dateModified: string;
  experimentDate: string;
  experimentID: string;
  privatePatientID: string;
  publisher: Organization;
  sampleID?: string;
  visitCode?: string;
}

export class SerologyData {
  antigen: string;
  antigenSource: string;
  antigenVirus: string;
  assayType: string;
  value: number;
  valueCategory: string;
  valueCategoryNumeric: number;
}

export class SerologyDownload {
  patientID: string;
  visitCode: string;
  sampleID: string;
  experimentID: string;
  batchID: string;
  assayType: string;
  antigenVirus: string;
  antigen: string;
  antigenSource: string;
  value: String;
  valueCategory: string;
  valueCategoryNumeric: string;
  experimentDate: string;
  source: string; // author
  citation: string;
  publisher: string;
  dataStatus: string;
  dateModified: string;
  correction: string;

  constructor(experiment: SystemsSerology) {
    this.patientID = experiment.privatePatientID;
    this.visitCode = experiment.visitCode;
    this.sampleID = experiment.sampleID;
    this.experimentID = experiment.experimentID;
    this.batchID = experiment.batchID;

    // Data should be an array of length 1.
    // Just to be sure, joining everything together, concatted by ";"
    this.assayType = experiment.data.map(d => d.assayType).join("; ")
    this.antigenVirus = experiment.data.map(d => d.antigenVirus).join("; ")
    this.antigen = experiment.data.map(d => d.antigen).join("; ")
    this.antigenSource = experiment.data.map(d => d.antigenSource).join("; ")
    this.value = experiment.data.map(d => d.value).join("; ")
    this.valueCategory = experiment.data.map(d => d.valueCategory).join("; ")
    this.valueCategoryNumeric = experiment.data.map(d => d.valueCategoryNumeric).join("; ")

    this.experimentDate = experiment.experimentDate;
    this.source = experiment.author ? experiment.author.name : null;
    this.citation = experiment.citation ? experiment.citation.map(d => d.url).join("; ") : null;
    this.publisher = experiment.publisher ? experiment.publisher.name : null;
    this.dataStatus = experiment.dataStatus;
    this.dateModified = experiment.dateModified;
    this.correction = experiment.correction;

  }
}
