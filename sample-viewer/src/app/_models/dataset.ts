import { Organization } from './organization';
import { DataDownload } from './data-download';

export class Dataset {
  "@type": string;
  "@context": string;
  name: string;
  description: string;
  measurementCategory: string;
  measurementTechnique: string[];
  variableMeasured: string[];
  url: string;
  identifier: string;
  includedInDataCatalog: string[];
  keywords: string[];
  dateModified: string;
  datePublished: string;
  creator: Organization[];
  publisher: Organization[];
  funding: Object[];
  sameAs: string[];
  updatedBy: string;
  temporalCoverage: any;
  spatialCoverage: Object[];
  version: string;
  dataDownloadIDs: string[];
  distribution: DataDownload[];
  sourceCode: Object[];
  citation: Object[];
  license: string;
  _id?: string;
  _score?: number;
}

// subset of dataset schema, to correspond with only the schema.org properties.
export class DatasetSchema {
  "@type": string;
  "@context": string;
  name: string;
  description: string;
  measurementTechnique: string[];
  variableMeasured: string[];
  url: string;
  identifier: string;
  includedInDataCatalog: string[];
  keywords: string[];
  dateModified: string;
  datePublished: string;
  creator: Organization[];
  publisher: Organization[];
  funding: Object[]; // not in schema.org, but should be...
  // sameAs: string[];
  temporalCoverage: any;
  spatialCoverage: Object[];
  version: string;
  distribution: DataDownload[];
  citation: Object[];
  license: string;
}
