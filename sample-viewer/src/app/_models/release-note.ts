export class ReleaseNote {
  dateReleased: string;
  version: string;
  notes: Note[];
}

export class Note {
  endpoint: string;
  note: string[];
}
