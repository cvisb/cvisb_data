import { Organization } from './organization';
import { Source, Citation} from './citation';

export class Experiment {
  experimentID: string;
  batchID?: string;
  sampleID?: string;
  visitCode?: string;
  patientID?: string;
  privatePatientID: string;
  sraID?: string;
  genbankID?: string;
  isControl?: boolean;
  name?: string;
  description?: string;
  experimentDate?: string;
  variableMeasured: string;
  measurementTechnique: string;
  measurementCategory?: string;
  includedInDataset: string;
  dateModified: string;
  updatedBy?: string;
  creator?: Organization;
  publisher?: Organization;
  citation?: Citation[];
  analysisCode?: any;
  correction?: string[];
  dataStatus?: string;
  sources?: Source[];
  sourceFiles?: string;
  releaseDate?: string;
  data?: any;
  _score?: number;
  _id?: string;
  _version?: number
}
