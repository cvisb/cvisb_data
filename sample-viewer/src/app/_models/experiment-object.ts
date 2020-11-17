export class ExperimentObject {
  variableMeasured: string[];
  measurementTechnique: string[];
  measurementCategory: string;
  dataset_id: string;
  icon_id: string;
  datasetName: string;
  anchor_link: string;
}

export class ExperimentCount {
  count: number;
  includedInDataset?: string[];
  measurementTechnique?: string[];
  measurementCategory?: string;
  term: string;
  datasetName?: string;
  disabled?: boolean;
}
