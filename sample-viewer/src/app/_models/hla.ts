import { D3Nested } from './d3-nested';

export class HLA {
  patientID: string;
  cohort: string;
  allele?: string; // optional b/c may be undefined
  locus: string;
  novel?: boolean;
  country?: string;
  outcome: string;
}

export class HLAsummary {
  key: string;
  value: number;
  pct: number;
  side?: string;
}

export class HLAnested extends D3Nested {
  // key: string;
  values: HLAsummary[];
  total?: number;
}
