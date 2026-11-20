import type { ServiceDetails } from '../types/records';

export interface ServiceMetadata {
  onlineUrl?: string;
  synonyms: string[];
  access?: ('online' | 'walk-in')[];
  office?: string;
  audiences?: string[];
  details?: ServiceDetails;
}

export const serviceMetadata: Record<string, ServiceMetadata> = {
  'business/apply-for-public-transport-mayors-permit': {
    synonyms: ['jeepney', 'tricycle', 'TODA', 'JODA', 'transportation'],
    access: ['walk-in'],
    office: 'Public Transportation and Regulatory Office',
    audiences: ['Residents', 'Businesses'],
  },
  'education/access-educational-support-programs-from-the-lgu': {
    synonyms: ['student', 'educational assistance'],
    audiences: ['Residents', 'Students'],
    office: 'City Social Welfare and Development Office',
    access: ['walk-in'],
  },
  'business/apply-for-barangay-clearance-and-mayors-business-permits': {
    onlineUrl: 'https://www.cityofangeles.ph/bpls/#services',
    access: ['online'],
    office: 'Business Permit and Licensing Division',
    audiences: ['Businesses'],
    details: {
      eligibility:
        'Applicants registering a business in Angeles City; requirements vary by business classification.',
      fees: 'Based on the official assessment of capital or gross receipts and applicable charges.',
      processingTime:
        'Three working days in the eBPLS charter, conditional on payment within that period.',
      location:
        'Ground floor, City Hall (August 2026 charter; confirm before visiting).',
      contacts:
        'Use your registered email for follow-up through eBPLS, as directed by the charter.',
      hours: null,
      forms: [
        {
          title: 'Business Permit Application Form, revision 33',
          url: '/documents/angeles-updates-2026-10-15/BPLD-ABP-001-Rev-33.pdf',
        },
      ],
      faqs: [
        {
          question: 'Which checklist should I follow?',
          answer:
            'The charter and revision 33 form differ on conditional requirements. Confirm the applicable checklist with BPLD before submitting.',
        },
      ],
      referenceDate:
        'Charter and form retrieved 15 October 2026; form edition 1 October 2025.',
      sourceIds: ['doc20261028:S10', 'doc20261028:S11'],
    },
    synonyms: [
      'eBPLS',
      'BPLD',
      'BOSS',
      'new business',
      'business registration',
    ],
  },
  'business/renew-permits-and-pay-local-business-taxes': {
    onlineUrl: 'https://www.cityofangeles.ph/bpls/#services',
    access: ['online'],
    office: 'Business Permit and Licensing Division',
    audiences: ['Businesses'],
    synonyms: ['eBPLS', 'BPLD', 'BOSS', 'business renewal'],
  },
  'health-services/apply-for-worker-health-certificate-cards': {
    onlineUrl: 'https://cityofangeles.ph/healthcard/',
    access: ['online'],
    office: 'City Health Office / Environmental Health Services',
    audiences: ['Residents', 'Businesses'],
    details: {
      eligibility:
        'Workers applying for a Health ID in Angeles City. Requirements depend on the worker category.',
      fees: null,
      processingTime: null,
      location:
        'EHS main office, 3rd floor, City Hall, Pulung Maragul. Confirm your appointment location in the official portal.',
      contacts:
        'Published sanitation-office telephone: 045-322-4483, locals 3025 / 3023. Working lines have not been independently confirmed.',
      hours: null,
      forms: [
        {
          title: 'Health ID application form',
          url: 'https://www.cityofangeles.ph/healthcard/documents/health-id-application-form',
        },
      ],
      faqs: [
        {
          question:
            'Is the general chest X-ray checklist the same for pregnant applicants?',
          answer:
            'Advisory No. 002 (5 February 2026) provides alternative documents for pregnant applicants. Read the qualification in the guide and confirm administrative requirements with EHS.',
        },
        {
          question: 'Are the archived fees today’s fees?',
          answer:
            'No current fee schedule was confirmed from the appointment portal. The August charter amounts below are historical reference values.',
        },
      ],
      referenceDate:
        'Portal and Advisory No. 002 checked 19 November 2026. Archived charter: August 2026.',
      sourceIds: ['doc20261028:S13', 'doc20261028:S14'],
    },
    synonyms: ['health ID', 'healthcard', 'sanitary ID', 'EHS', 'appointment'],
  },
  'civil-documents/request-certified-civil-registry-documents': {
    access: ['walk-in'],
    office: 'City Civil Registry Office',
    audiences: ['Residents'],
    synonyms: [
      'birth certificate',
      'marriage certificate',
      'death certificate',
    ],
  },
  'social-welfare/apply-for-senior-citizen-solo-parent-or-pwd-assistance': {
    audiences: ['Residents', 'Seniors', 'PWDs'],
    synonyms: [
      'disability',
      'persons with disabilities',
      'senior',
      'solo parent',
    ],
  },
};

export const serviceTopics: {
  name: string;
  categories: string[];
  serviceSlugs?: string[];
}[] = [
  { name: 'Certificates', categories: ['civil-documents'] },
  { name: 'Business', categories: ['business'] },
  { name: 'Tax Payments', categories: ['taxes-fees'] },
  {
    name: 'Transportation',
    categories: [],
    serviceSlugs: ['apply-for-public-transport-mayors-permit'],
  },
  { name: 'Social Services', categories: ['social-welfare'] },
  { name: 'Health', categories: ['health-services'] },
  { name: 'Agriculture', categories: ['agriculture-fisheries'] },
  {
    name: 'Infrastructure',
    categories: ['infrastructure-public-works', 'housing-land-use'],
  },
  { name: 'Education', categories: ['education'] },
  { name: 'Public Safety', categories: ['disaster-preparedness'] },
  {
    name: 'Environment',
    categories: ['environment', 'garbage-waste-disposal'],
  },
];
