export interface ServiceMetadata {
  onlineUrl?: string;
  synonyms: string[];
}

export const serviceMetadata: Record<string, ServiceMetadata> = {
  'business/apply-for-barangay-clearance-and-mayors-business-permits': {
    onlineUrl: 'https://cityofangeles.ph/bpls/',
    synonyms: [
      'eBPLS',
      'BPLD',
      'BOSS',
      'new business',
      'business registration',
    ],
  },
  'business/renew-permits-and-pay-local-business-taxes': {
    onlineUrl: 'https://cityofangeles.ph/bpls/',
    synonyms: ['eBPLS', 'BPLD', 'BOSS', 'business renewal'],
  },
  'health-services/apply-for-worker-health-certificate-cards': {
    onlineUrl: 'https://cityofangeles.ph/healthcard/',
    synonyms: ['health ID', 'healthcard', 'sanitary ID', 'EHS', 'appointment'],
  },
  'civil-documents/request-certified-civil-registry-documents': {
    synonyms: [
      'birth certificate',
      'marriage certificate',
      'death certificate',
    ],
  },
  'social-welfare/apply-for-senior-citizen-solo-parent-or-pwd-assistance': {
    synonyms: [
      'disability',
      'persons with disabilities',
      'senior',
      'solo parent',
    ],
  },
};
