import { Citation } from './citation';

export class ViralSeqObj {
  publisher: Object;
  citation: Citation[];
  cvisb_data: boolean;
  data: ViralSeqData;
  experimentID: string;
}

export class ViralSeqData {
  virus: string;
  quality: number;
  DNAsequence: string;
}
