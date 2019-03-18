export class ESResult {
  max_score: number;
  total: number;
  facets?: Object;
  hits?: any[];

}

export class ESFacet {
  _type: string;
  missing: number;
  other: number;
  terms: ESFacetTerms[];
  total: number;
}

export class ESFacetTerms {
  term: string;
  count: number;
}
