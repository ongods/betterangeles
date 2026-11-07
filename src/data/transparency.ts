export interface PublicRecord {
  id: string;
  title: string;
  kind: 'Document' | 'Revenue' | 'Procurement' | 'Project';
  referenceDate: string;
  evidence:
    | 'Archived document'
    | 'City report'
    | 'Published notice'
    | 'Provisional extract';
  summary: string;
  amount: number | null;
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
    amountType: 'Reported project cost',
    currency: 'PHP',
    progress: null,
    downloadUrl: null,
    sourceIds: ['doc20261028:S50'],
  },
];
