export class Dataset {
  name: string;
  description: string;
  measurementCategory: string;
  measurementTechnique: string[];
  url: string;
  identifier: string;
  includedInDataCatalog: string[];
  keywords: string[];
  dateModified: string;
  author: Object[];
  publisher: Object[];
  funding: Object[];
}
