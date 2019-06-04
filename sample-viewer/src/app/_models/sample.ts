export class Sample {
  _id: string;
  dateModified: string;
  derivedIndex?: number;
  isolationDate: string;
  location: Object[];
  privatePatientID: string;
  sampleID: string;
  sampleType: string;
  sourceSampleID?: string;
  sourceSampleType?: string;
  species: string;
  visitCode?: string;
}

export interface SampleWide {
}
