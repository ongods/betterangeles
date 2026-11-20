import { normalizeSearch } from './serviceCatalog';

export interface PublicRecord {
  id: string;
  title: string;
  kind: 'Document' | 'Revenue' | 'Procurement' | 'Project' | 'Budget' | 'Audit';
  referenceDate: string;
  evidence:
    | 'Archived document'
    | 'City report'
    | 'Published notice'
    | 'Provisional extract';
  summary: string;
  amount: number | null;
  amountState: 'reported' | 'unknown' | 'not-applicable';
  amountType: string | null;
  currency: 'PHP';
  progress: number | null;
  downloadUrl: string | null;
  sourceIds: string[];
}

export const publicRecords: PublicRecord[] = [
  {
    id: 'ebpls-charter',
    title: 'eBPLS Citizen’s Charter',
    kind: 'Document',
    referenceDate: 'Retrieved 15 October 2026',
    evidence: 'Archived document',
    summary:
      'Business permit procedures. This charter covers eBPLS, not all city services.',
    amount: null,
    amountState: 'not-applicable',
    amountType: null,
    currency: 'PHP',
    progress: null,
    downloadUrl:
      '/documents/angeles-updates-2026-10-15/eBPLS-Citizen-Charter.pdf',
    sourceIds: ['doc20261028:S10'],
  },
  {
    id: 'business-form',
    title: 'Business Permit Application Form, revision 33',
    kind: 'Document',
    referenceDate: '1 October 2025 form edition',
    evidence: 'Archived document',
    summary:
      'BPLD-ABP-001. Its conditional checklist differs from the charter; confirm the applicable requirements with BPLD.',
    amount: null,
    amountState: 'not-applicable',
    amountType: null,
    currency: 'PHP',
    progress: null,
    downloadUrl:
      '/documents/angeles-updates-2026-10-15/BPLD-ABP-001-Rev-33.pdf',
    sourceIds: ['doc20261028:S11'],
  },
  {
    id: 'revenue-2024',
    title: 'FY 2024 locally sourced revenue',
    kind: 'Revenue',
    referenceDate: 'FY 2024; city report dated 3 December 2025',
    evidence: 'City report',
    summary:
      'City-reported locally sourced revenue associated with BLGF recognition. This is not the annual budget or total operating income.',
    amount: 1856941184.83,
    amountState: 'reported',
    amountType: 'Reported locally sourced revenue',
    currency: 'PHP',
    progress: null,
    downloadUrl: null,
    sourceIds: ['doc20261028:S46'],
  },
  {
    id: 'philgeps-13222581',
    title: 'Machine for Blood Bank Section',
    kind: 'Procurement',
    referenceDate:
      'Published 3 September 2026; closing 7 September 2026 at 13:00',
    evidence: 'Published notice',
    summary:
      'PhilGEPS 13222581; solicitation 109-26. The closing date has elapsed. The source’s “Active” label does not establish the present award or procurement status. Actual expenditure and award are unverified.',
    amount: 1705000,
    amountState: 'reported',
    amountType: 'Approved budget for the contract (ABC)',
    currency: 'PHP',
    progress: null,
    downloadUrl: null,
    sourceIds: ['doc20261028:S48'],
  },
  {
    id: 'dpwh-25ci0039',
    title: 'Abacan Road Dike between Henson and Abacan bridges',
    kind: 'Project',
    referenceDate: 'Award-document extract approved 14 March 2025',
    evidence: 'Provisional extract',
    summary:
      'DPWH 25CI0039. The full award PDF was not accessed during collection. Funding, contractor, start/end dates, and current progress are unknown.',
    amount: 94374619.06,
    amountState: 'reported',
    amountType:
      'Amount in indexed award-document extract; full-document check pending',
    currency: 'PHP',
    progress: null,
    downloadUrl: null,
    sourceIds: ['doc20261028:S49'],
  },
  {
    id: 'pampang-market',
    title: 'Pampang Public Market redevelopment',
    kind: 'Project',
    referenceDate:
      'Inauguration scheduled for 29 November 2024 in a city report',
    evidence: 'City report',
    summary:
      'A historical city announcement. Contract records, audited final cost, completion proof, and current progress have not been obtained.',
    amount: 400000000,
    amountState: 'reported',
    amountType: 'Reported project cost',
    currency: 'PHP',
    progress: null,
    downloadUrl: null,
    sourceIds: ['doc20261028:S50'],
  },
];

export interface RecordContext {
  year: string;
  location: string | null;
  agency: string | null;
  funding: string | null;
  contractor: string | null;
  startDate: string | null;
  endDate: string | null;
  sourceStatus: string | null;
  deadline: string | null;
}

const unknownContext = {
  location: null,
  agency: null,
  funding: null,
  contractor: null,
  startDate: null,
  endDate: null,
  sourceStatus: null,
  deadline: null,
};
export const recordContexts: Record<string, RecordContext> = {
  'ebpls-charter': {
    ...unknownContext,
    year: '2026',
    agency: 'Business Permit and Licensing Division',
  },
  'business-form': {
    ...unknownContext,
    year: '2025',
    agency: 'Business Permit and Licensing Division',
  },
  'revenue-2024': { ...unknownContext, year: '2024' },
  'philgeps-13222581': {
    ...unknownContext,
    year: '2026',
    sourceStatus: 'Active',
    deadline: '2026-09-07T13:00:00+08:00',
  },
  'dpwh-25ci0039': {
    ...unknownContext,
    year: '2025',
    location: 'Abacan Road Dike between Henson and Abacan bridges',
    agency: 'DPWH',
  },
  'pampang-market': {
    ...unknownContext,
    year: '2024',
    location: 'Pampang Public Market, Angeles City',
  },
};

export function procurementDeadline(
  context: Pick<RecordContext, 'deadline'>,
  now = new Date()
): string {
  if (!context.deadline) return 'Closing date not confirmed';
  return now.getTime() > new Date(context.deadline).getTime()
    ? 'Listed deadline has elapsed; award status is unverified'
    : 'Within the listed submission period; confirm with the issuing office';
}

export function searchPublicRecords(
  query: string,
  kind = '',
  year = ''
): PublicRecord[] {
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  return publicRecords.filter(
    item =>
      (!kind || item.kind === kind) &&
      (!year || recordContexts[item.id]?.year === year) &&
      words.every(word =>
        normalizeSearch(
          `${item.title} ${item.summary} ${item.referenceDate}`
        ).includes(word)
      )
  );
}

/** PHP amounts are stored to at most two decimal places; no mixed-type totals. */
export function formatRecordAmount(record: PublicRecord): string {
  return record.amountState === 'not-applicable'
    ? 'Not applicable'
    : formatMoney(record.amount);
}

export function formatMoney(value: number | null): string {
  return value === null
    ? 'Amount not confirmed'
    : new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
}
