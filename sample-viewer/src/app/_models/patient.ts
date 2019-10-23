import { DateRangePipe } from "../_pipes/date-range.pipe";

export class Patient {
  // TODO: resort location based on inverse specificity
  patientID: string;
  infectionYear?: number;
  infectionDate?: string;
  evalDate?: string;
  dischargeDate?: string;
  daysOnset?: number;
  daysInHospital?: number;
  admitDate?: string;
  dateModified?: string;
  cohort: string;
  outcome?: string;
  alternateIdentifier?: string[];
  contactGroupIdentifier?: string;
  contactSurvivorRelationship?: string;
  age?: number;
  gender?: string;
  country?: Object;
  homeLocation?: Object[];
  associatedSamples?: string[];
  availableData?: Object[];
  relatedTo?: string[];
  elisa?: ELISA[];
  pregnant: boolean;
  species: string;
  admin2: Object;
  occupation: string;
  symptoms?: Object[];
  sID?: string;
  gID?: string[];
  exposureType?: string;
  _version?: number;
  updatedBy?: string;
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
  admin2?: string;
  dateModified?: string;
  elisa?: string;
  exposureType?: string;
  gender?: string;
  outcome?: string;
  patientID: string;
  relatedTo?: string;
  updatedBy?: string;
  blurry_vision?: boolean;
  burning_eyes?: boolean;
  dry_eyes?: boolean;
  eye_foreign_body_sensation?: boolean;
  eye_pain?: boolean;
  hearing_loss?: boolean;
  joint_pain?: boolean;
  light_sensitivity?: boolean;
  muscle_pain?: boolean;
  ringing_in_ears?: boolean;
  vision_loss?: boolean;
  species: string;
  sID: string;
  gID: string;
  daysInHospital: number;
  daysOnset: number;
  dischargeDate: string;
  evalDate: string;
  infectionDate: string;
  infectionYear: number;

  constructor(patient: Patient, datePipe: DateRangePipe) {
    this.patientID = patient.patientID;
    this.alternateIdentifier = patient.alternateIdentifier ? patient.alternateIdentifier.join(", ") : null;
    this.sID = patient.sID;
    this.gID = patient.gID ? patient.gID.join(", ") : null;
    this.cohort = patient.cohort;
    this.outcome = patient.outcome;
    this.country = patient.country ? patient.country['name'] : null;
    this.admin2 = patient.admin2 ? patient.admin2['name'] : null;
    this.species = patient.species;
    this.gender = patient.gender;
    this.age = patient.age;
    this.infectionYear = patient.infectionYear;
    this.infectionDate = datePipe.transform(patient.infectionDate);
    this.daysInHospital = patient.daysInHospital;
    this.dischargeDate = datePipe.transform(patient.dischargeDate);
    this.evalDate = datePipe.transform(patient.evalDate);
    this.daysOnset = patient.daysOnset;

    this.contactGroupIdentifier = `"${patient.contactGroupIdentifier}"`; // encapsulate in quotes to retain as strings
    this.relatedTo = patient.relatedTo ? patient.relatedTo.join(", ") : null;
    this.contactSurvivorRelationship = patient.contactSurvivorRelationship;
    this.exposureType = patient.exposureType;



    if (patient.symptoms && patient.symptoms[0]) {
      this.blurry_vision = patient.symptoms[0]['symptoms']['blurry_vision'];
      this.burning_eyes = patient.symptoms[0]['symptoms']['burning_eyes'];
      this.dry_eyes = patient.symptoms[0]['symptoms']['dry_eyes'];
      this.eye_foreign_body_sensation = patient.symptoms[0]['symptoms']['eye_foreign_body_sensation'];
      this.eye_pain = patient.symptoms[0]['symptoms']['eye_pain'];
      this.hearing_loss = patient.symptoms[0]['symptoms']['hearing_loss'];
      this.joint_pain = patient.symptoms[0]['symptoms']['joint_pain'];
      this.light_sensitivity = patient.symptoms[0]['symptoms']['light_sensitivity'];
      this.muscle_pain = patient.symptoms[0]['symptoms']['muscle_pain'];
      this.ringing_in_ears = patient.symptoms[0]['symptoms']['ringing_in_ears'];
      this.vision_loss = patient.symptoms[0]['symptoms']['vision_loss']
    }

    if (patient.elisa && patient.elisa[0]) {
      this.elisa = JSON.stringify(patient.elisa);
    }

    this._version = patient._version;
    this.dateModified = datePipe.transform(patient.dateModified);
    this.updatedBy = patient.updatedBy;

  }
}

export class ELISA {
  ELISAresult: string;
  assayType: string;
  timepoint: string;
  virus: string;
}
