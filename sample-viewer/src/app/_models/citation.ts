export class Citation {
  doi: string;
  pmid: string;
  issn: string;
  identifier: string;
  datePublished: string;
  author: AuthorName[];
  issueNumber: string;
  journalName: string;
  journalNameAbbrev: string;
  name: string;
  pagination: string;
  url: string;
  volumeNumber: string;
}

export class Source {
  doi: string;
  pmid: string;
  issn: string;
  identifier: string;
  datePublished: string;
  author: AuthorName[];
  issueNumber: string;
  journalName: string;
  journalNameAbbrev: string;
  name: string;
  pagination: string;
  url: string;
  volumeNumber: string;
  type: string;
  count: number;
  percent: number;
  contactPoint: any;
  source: string;
}

export class AuthorName {
  familyName: string;
  givenName: string;
}

export class issueDate {
  "date-parts": number[][];
}
