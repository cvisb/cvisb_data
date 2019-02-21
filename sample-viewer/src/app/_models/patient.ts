export class Patient {
  // TODO: resort location based on inverse specificity
  patientID: string;
  infectionYear?: number;
  infectionDate?: string;
  admitDate?: string;
  dateModified?: string;
  cohort: string;
  outcome?: string;
  alternateIdentifier?: string[];
  age?: number;
  gender?: string;
  country?: Object;
  homeLocation?: Object[];
  associatedSamples?: string[];
  availableData?: Object[];
  relatedTo?: string[];
  elisa?: Object[];
}
