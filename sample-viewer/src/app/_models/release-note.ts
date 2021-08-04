export class ReleaseNote {
  datePublished: string;
  version: string;
  description: Note[];
}

export class Note {
  category: string;
  description: string[];
}
