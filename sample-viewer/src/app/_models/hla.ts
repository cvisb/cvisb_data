import { D3Nested } from './d3-nested';

export class HLA {
  ID: string;
  Status: string;
  allele_short?: string; // optional b/c may be undefined
  loci: string;
  novel?: boolean;
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
