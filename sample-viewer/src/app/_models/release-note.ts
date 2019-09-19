export class ReleaseNote {
  datePublished: string;
  version: string;
  description: Note[];
}

export class Note {
  endpoint: string;
  description: string[];
}
