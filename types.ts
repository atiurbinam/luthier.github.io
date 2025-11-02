export interface SequenceStep {
  step: number;
  note: string | null;
  active: boolean;
  gate: number;
}

export interface ChordProgressionResponse {
  chords: string[];
  sequence: SequenceStep[];
}
