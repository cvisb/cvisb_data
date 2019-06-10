export class ReleaseNote {
  dateReleased: string;
  version: number;
  notes: Note[];
}

export class Note {
  endpoint: string;
  note: string[];
}
