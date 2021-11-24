import { DateRangePipe } from "../_pipes/date-range.pipe";
import { Citation } from './citation';
import { Organization } from './organization';
import { ExperimentCount } from './experiment-object';
import { ESFacetTerms, ESResult } from './es-result';
import { Sample } from './sample';

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
  exposureLocation?: Object[];
  associatedSamples?: string[];
  availableData?: Object[];
  samples?: Sample[];
  relatedTo?: string[];
  elisa?: ELISA[];
  pregnant: boolean;
  species: string;
  admin2: Object;
  admin3: Object;
  occupation: string;
  symptoms?: Object[];
  sID?: string;
  gID?: string[];
  exposureType?: string;
  version?: string;
  updatedBy?: string;
  dataStatus: string;
  correction: string;
  citation: Citation[];
  publisher: Organization;
  source: Organization[]
}

export class UnknownCount {
  term: string;
  count: number;

  constructor(count: number) {
    this.term = "unknown";
    this.count = count;
  }
}

export class PatientSummary {
  total: number;
  // patientIDs: string[];
  relatedIDs?: string[];
  patientTypes: ESFacetTerms[];
  patientOutcomes: ESFacetTerms[];
  patientCountries: ESFacetTerms[];
  patientYears: ESFacetTerms[];
  yearDomain?: number[];
  cohortDomain?: string[];
  outcomeDomain?: string[];
  exptTypes: ESFacetTerms[];
  experiments?: ExperimentCount[];

  constructor(patients: ESResult) {
    let facet_obj = patients.facets;
    this.total = patients.total;

    // this.patientIDs = facet_obj["patientID.keyword"].terms.map((d: ESFacetTerms) => d.term);
    this.patientTypes = facet_obj["cohort.keyword"].terms;
    this.patientOutcomes = facet_obj["outcome.keyword"].terms;
    this.patientYears = facet_obj["infectionYear"].terms;
    this.patientCountries = facet_obj["country.identifier.keyword"].terms;

    // Check for null values.
    if (facet_obj["cohort.keyword"].total < this.total) {
      this.patientTypes.push(new UnknownCount(this.total - facet_obj["cohort.keyword"].total));
    }

    if (facet_obj["outcome.keyword"].total < this.total) {
      this.patientOutcomes.push(new UnknownCount(this.total - facet_obj["outcome.keyword"].total));
    }

    if (facet_obj["infectionYear"].total < this.total) {
      this.patientYears.push(new UnknownCount(this.total - facet_obj["infectionYear"].total));
    }

    if (facet_obj["country.identifier.keyword"].total < this.total) {
      this.patientCountries.push(new UnknownCount(this.total - facet_obj["country.identifier.keyword"].total));
    }

  }
}

export class ResolverPatientSummary {
  allPatientSummary: PatientSummary;
  selectedPatientSummary: PatientSummary;
}


// Constructor to de-nest nested objects for download.
export class PatientDownload {
  version?: string;
  age?: number;
  alternateIdentifier?: string;
  cohort?: string;
  contactGroupIdentifier?: string;
  contactSurvivorRelationship?: string;
  country?: string;
  admin2?: string;
  admin3?: string;
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
  citation: string;
  source?: string;
  correction: string;
  dataStatus: string;

  constructor(patient: Patient, datePipe: DateRangePipe) {
    this.patientID = patient.patientID;
    this.alternateIdentifier = patient.alternateIdentifier ? patient.alternateIdentifier.join(", ") : null;
    this.sID = patient.sID;
    this.gID = patient.gID ? patient.gID.join(", ") : null;
    this.cohort = patient.cohort;
    this.outcome = patient.outcome;
    this.gender = patient.gender;
    this.age = patient.age;
    this.species = patient.species;
    this.country = patient.country ? patient.country['name'] : null;
    this.admin2 = patient.admin2 ? patient.admin2['name'] : null;
    this.admin3 = patient.admin3 ? patient.admin3['name'] : null;


    this.infectionYear = patient.infectionYear;
    this.infectionDate = datePipe.transform(patient.infectionDate);
    this.evalDate = datePipe.transform(patient.evalDate);
    this.dischargeDate = datePipe.transform(patient.dischargeDate);
    this.daysOnset = patient.daysOnset;
    this.daysInHospital = patient.daysInHospital;

    this.contactGroupIdentifier = `"${patient.contactGroupIdentifier}"`; // encapsulate in quotes to retain as strings
    this.relatedTo = patient.relatedTo ? patient.relatedTo.join(", ") : null;
    this.contactSurvivorRelationship = patient.contactSurvivorRelationship;
    this.exposureType = patient.exposureType;

    this.citation = patient.citation ? patient.citation.map(d => d.url).join("; ") : null;
    this.source = patient.publisher ? patient.publisher.name : null;
    this.dataStatus = patient.dataStatus;
    this.version = patient.version;
    this.dateModified = datePipe.transform(patient.dateModified);
    this.updatedBy = patient.updatedBy;
    this.correction = patient.correction;

    if (patient.symptoms && patient.symptoms[0]) {
      this.blurry_vision = patient.symptoms['blurry_vision'] ? patient.symptoms['blurry_vision'] : null;
      this.burning_eyes = patient.symptoms['burning_eyes'] ? patient.symptoms['burning_eyes'] : null;
      this.dry_eyes = patient.symptoms['dry_eyes'] ? patient.symptoms['dry_eyes'] : null;
      this.eye_foreign_body_sensation = patient.symptoms['eye_foreign_body_sensation'] ? patient.symptoms['eye_foreign_body_sensation'] : null;
      this.eye_pain = patient.symptoms['eye_pain'] ? patient.symptoms['eye_pain'] : null;
      this.hearing_loss = patient.symptoms['hearing_loss'] ? patient.symptoms['hearing_loss'] : null;
      this.joint_pain = patient.symptoms['joint_pain'] ? patient.symptoms['joint_pain']: null;
      this.light_sensitivity = patient.symptoms['light_sensitivity'] ? patient.symptoms['light_sensitivity'] : null;
      this.muscle_pain = patient.symptoms['muscle_pain'] ? patient.symptoms['muscle_pain'] : null;
      this.ringing_in_ears = patient.symptoms['ringing_in_ears'] ? patient.symptoms['ringing_in_ears'] : null;
      this.vision_loss = patient.symptoms['vision_loss'] ? patient.symptoms['vision_loss'] : null;
    }

    if (patient.elisa && patient.elisa[0]) {
      this.elisa = JSON.stringify(patient.elisa);
    }
  }
}

export class ELISA {
  ELISAresult: string;
  ELISAvalue?: number;
  assayType: string;
  timepoint: string;
  virus: string;
  "@type": string;
  dataStatus: string;
  publisher: Organization;
  citation: Citation[];
  correction: string;
  sourceFiles: string;
}
