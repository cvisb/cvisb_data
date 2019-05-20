export class Citation {
  DOI: string;
  PMID: string;
  author: AuthorName[];
  "container-title": string;
  "container-title-short": string;
  issue: string;
  page: string;
  title: string;
  volume: string;
  issued: issueDate;
}

export class AuthorName {
  family: string;
  given: string;
}

export class issueDate {
  "date-parts": number[][];
}
