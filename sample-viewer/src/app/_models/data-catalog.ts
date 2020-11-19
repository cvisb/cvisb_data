import { Organization } from './organization';
import { ReleaseNote } from './release-note';

export class DataCatalog {
  "@type": string;
  _id?: string;
  _score?: number;
  alternateName: string[];
  dateModified: string;
  description: string;
  funding: any[];
  identifier: string;
  license: string;
  name: string;
  publisher: Organization[];
  releaseNotes: ReleaseNote[];
  releaseVersion: string;
  updatedBy: string;
  url: string;
}
