/** Publication state belongs to each fact, independently of record coverage. */
export type EvidenceState =
  | 'source-supported'
  | 'provisional'
  | 'unknown'
  | 'not-retrieved'
  | 'not-applicable'
  | 'confirmed-none';

export interface SourcedField<T> {
  value: T | null;
  state: EvidenceState;
  sourceIds: string[];
  referenceDate?: string;
  checkedOn?: string;
  note?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  sourceUrl: string;
  checkedOn: string;
  state: 'validated' | 'candidate';
}

export interface ServiceDetails {
  eligibility: string | null;
  requirements?: string[];
  steps?: string[];
  fees: string | null;
  processingTime: string | null;
  location: string | null;
  contacts: string | null;
  hours: string | null;
  forms: { title: string; url: string }[];
  faqs: { question: string; answer: string }[];
  referenceDate: string;
  sourceIds: string[];
}
