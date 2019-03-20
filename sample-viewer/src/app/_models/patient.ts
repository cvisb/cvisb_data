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
  symptoms?: Object[];
  _version?: number;
}



// Constructor to de-nest nested objects for download.
export class PatientDownload {
  _version?: number;
  age?: number;
  alternateIdentifier?: string;
  cohort?: string;
  contactGroupIdentifier?: string;
  contactSurvivorRelationship?: string;
  country?: string;
  dateModified?: string;
  elisa?: any;
  exposureType?: string;
  gender?: string;
  outcome?: string;
  patientID: string;
  relatedTo?: string[];
  symptoms?: Object;
  updatedBy?: string;


  constructor(patient: Patient) {
    console.log(patient)
    this.patientID = patient.patientID;
    this._version = patient._version;
    this.age = patient.age;
    this.alternateIdentifier = patient.alternateIdentifier.join(", ");

    // TODO: ELISAs

  }
}
