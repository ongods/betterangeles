// Prototype content. Guides with `status: 'illustrative'` are layout samples, not verified government facts.
// Guides with `status: 'sourced'` restate the BetterAngeles repository guides and cite their saved charter copies.
export const REPO = 'https://github.com/ongods/betterangeles'
export const REPO_ISSUES = 'https://github.com/ongods/betterangeles/issues/new'
export const issueUrl = (title: string, page: string) =>
  `${REPO_ISSUES}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(`Page: ${page}\n\nWhat is wrong or missing?\n\nOfficial source link:\n`)}`
export const LINKS = {
  city: 'https://angelescity.gov.ph/',
  cityNews: 'https://angelescity.gov.ph/news/',
  charters: 'https://angelescity.gov.ph/citizens-charter/',
  ebpls: 'https://www.cityofangeles.ph/bpls/#services',
  health: 'https://cityofangeles.ph/healthcard/',
  psa: 'https://psa.gov.ph/classification/psgc/barangays/0330100000',
  pagasa: 'https://www.pagasa.dost.gov.ph/',
  osm: 'https://www.openstreetmap.org/#map=13/15.145/120.594',
}

export type Category = { slug: string; name: string; blurb: string; icon: string }
export const categories: Category[] = [
  { slug: 'civil-documents', name: 'Civil documents', blurb: 'Birth, marriage, death records and certificates.', icon: 'FileText' },
  { slug: 'taxes-and-fees', name: 'Taxes and fees', blurb: 'Real property, community tax and local fees.', icon: 'Receipt' },
  { slug: 'health', name: 'Health', blurb: 'Health IDs, clinics and public health services.', icon: 'HeartPulse' },
  { slug: 'education', name: 'Education', blurb: 'Schools, scholarships and student support.', icon: 'GraduationCap' },
  { slug: 'business-and-livelihood', name: 'Business and livelihood', blurb: 'Permits, renewals and livelihood programs.', icon: 'Store' },
  { slug: 'social-welfare', name: 'Social welfare', blurb: 'Senior, PWD, solo parent and family assistance.', icon: 'HandHeart' },
  { slug: 'agriculture-and-fisheries', name: 'Agriculture and fisheries', blurb: 'Farmer and fisherfolk services.', icon: 'Wheat' },
  { slug: 'infrastructure', name: 'Infrastructure', blurb: 'Building, roads and engineering permits.', icon: 'Construction' },
  { slug: 'waste-disposal', name: 'Waste disposal', blurb: 'Collection and solid waste guidance.', icon: 'Trash2' },
  { slug: 'environment', name: 'Environment', blurb: 'Environmental clearances and programs.', icon: 'Leaf' },
  { slug: 'disaster-preparedness', name: 'Disaster preparedness', blurb: 'Preparedness guidance and advisories.', icon: 'Siren' },
  { slug: 'housing-and-land-use', name: 'Housing and land use', blurb: 'Zoning, land use and housing.', icon: 'Home' },
]

export type Access = 'Online' | 'Walk-in' | 'Online and walk-in'
export type Audience = 'Residents' | 'Businesses' | 'Students' | 'Seniors' | 'PWDs'
export type Download = { label: string; note: string; href?: string; official?: string; format?: string; size?: string; date?: string; archived?: boolean }
export type Source = { label: string; href: string; saved?: string; date?: string }
export type Service = {
  slug: string; category: string; title: string; summary: string; office: string; access: Access
  audience: Audience[]; description: string; eligibility: string; requirements: string[]; steps: string[]
  fees: string; processing: string; portal?: { label: string; href: string }; where?: string
  downloads: Download[]; faqs: { q: string; a: string }[]
  status: 'sourced' | 'illustrative'; sources: Source[]; reviewed: string; related: string[]
}
const NS = 'Not stated in the prototype sample. Confirm with the responsible office.'
const mk = (s: Partial<Service> & Pick<Service, 'slug' | 'category' | 'title' | 'summary' | 'office' | 'access' | 'audience'>): Service => ({
  description: s.summary, eligibility: 'See the source document for eligibility rules.',
  requirements: ['Valid government-issued ID', 'Other documents as listed in the source'],
  steps: ['Check the requirements below.', 'Prepare originals and photocopies.', 'Visit the responsible office during office hours.', 'Follow the office’s instructions for payment and release.'],
  fees: NS, processing: NS, downloads: [], faqs: [], status: 'illustrative',
  sources: [{ label: 'Official city website', href: LINKS.city }], reviewed: 'Illustrative sample', related: [], ...s,
})

const BPLD = 'Business Permit and Licensing Division (BPLD)'
const BPLD_WHERE = 'Apply online through eBPLS. The August charter placed BPLD on the ground floor of City Hall; its hours have not been reconfirmed, so check current city announcements before visiting.'
const permitDownloads: Download[] = [
  { label: 'Business Permit Application Form (BPLD-ABP-001, revision 33)', note: 'Current paper form, dated October 1, 2025. Use when a paper form is requested.', href: '/documents/angeles-updates-2026-10-15/BPLD-ABP-001-Rev-33.pdf', official: 'https://angelescity.gov.ph/wp-content/uploads/2026/10/BPLD-ABP-001-Rev-33.pdf', format: 'PDF', size: '669 KB', date: 'Retrieved October 15, 2026' },
  { label: 'eBPLS Citizen’s Charter', note: 'Current online procedure, requirements and processing time.', href: '/documents/angeles-updates-2026-10-15/eBPLS-Citizen-Charter.pdf', official: 'https://angelescity.gov.ph/wp-content/uploads/2026/10/eBPLS-Citizen-Charter.pdf', format: 'PDF', size: '165 KB', date: 'Retrieved October 15, 2026' },
  { label: 'Business Permit Form (revision 30, archived)', note: 'Previous form dated September 1, 2023. Historical reference only.', href: '/documents/angeles-services/001-business-permit-form.pdf', official: 'https://www.angelescity.gov.ph/assets/pdf/business/business_license/BUSINESS-PERMIT-FORM.pdf', format: 'PDF', size: '127 KB', date: 'Archived August 2026', archived: true },
]
const permitSources: Source[] = [
  { label: 'eBPLS Citizen’s Charter', href: 'https://angelescity.gov.ph/wp-content/uploads/2026/10/eBPLS-Citizen-Charter.pdf', saved: '/documents/angeles-updates-2026-10-15/eBPLS-Citizen-Charter.pdf', date: 'Retrieved October 15, 2026' },
  { label: 'BPLD-ABP-001 revision 33 form', href: 'https://angelescity.gov.ph/wp-content/uploads/2026/10/BPLD-ABP-001-Rev-33.pdf', saved: '/documents/angeles-updates-2026-10-15/BPLD-ABP-001-Rev-33.pdf', date: 'Retrieved October 15, 2026' },
  { label: 'City of Angeles BPLS portal', href: LINKS.ebpls },
]

export const services: Service[] = [
  mk({
    slug: 'business-permit-application', category: 'business-and-livelihood', title: 'Business permit application (new)',
    summary: 'Requirements and steps for registering a new business in Angeles City, with a handoff to the official eBPLS portal.',
    office: BPLD, access: 'Online and walk-in', audience: ['Businesses'], status: 'sourced', reviewed: 'October 15, 2026', where: BPLD_WHERE,
    description: 'A business permit (Mayor’s permit) authorizes a business to operate within the city. New applications are filed through the city’s electronic Business Permit and Licensing System (eBPLS) and handled by BPLD through the Business One-Stop Shop (BOSS).',
    eligibility: 'Individuals and entities intending to operate a business within Angeles City. Additional requirements depend on the business classification; confirm the applicable checklist with BPLD.',
    requirements: ['Completed eApplication Form', 'Proof of business registration or legal personality: DTI, SEC or CDA, as applicable', 'Business capitalization, used to compute taxes, fees and charges', 'Occupancy permit for the constructed building', 'BFP certification (added in revision 33 of the paper form)', 'Barangay clearance (the paper form makes this conditional; the online charter lists it separately)', 'Lease contract, if you rent the premises', 'Community Tax Certificate (cedula)'],
    steps: ['Register in eBPLS and activate your account using the email prompt.', 'Select New Business Application and complete items 1–3.', 'Upload scanned requirements in item 4, choose pickup or delivery of the original permit, and submit.', 'Monitor your registered email and upload any additional documents requested.', 'Check the billing statement in the portal and follow its redirect to Landbank Link.BizPortal to pay the assessed amount.', 'Print the electronic business permit after approval and follow the pickup or delivery arrangement for the originals.'],
    fees: 'Depends on assessed capital or gross receipts and the city’s tax ordinance. The portal shows your assessment.',
    processing: 'Three working days, provided payment is made within that period (current eBPLS charter). The August walk-in charter’s two-day estimate is historical.',
    portal: { label: 'Continue to official eBPLS', href: LINKS.ebpls }, sources: permitSources, downloads: permitDownloads,
    faqs: [{ q: 'Does BetterAngeles process my application?', a: 'No. BetterAngeles is a community guide. All applications are handled on the official eBPLS portal.' }, { q: 'How much will I pay?', a: 'Fees depend on business type and assessment. The portal shows your assessed amount before payment.' }, { q: 'Which form revision should I use?', a: 'Revision 33, dated October 1, 2025. Its October 2026 upload path is not the revision date. Revision 30 is kept only as a historical reference.' }],
    related: ['business-permit-renewal', 'barangay-clearance', 'community-tax-certificate'],
  }),
  mk({
    slug: 'business-permit-renewal', category: 'business-and-livelihood', title: 'Business permit renewal',
    summary: 'Renew an existing business permit through eBPLS using the current renewal checklist.', office: BPLD,
    access: 'Online and walk-in', audience: ['Businesses'], status: 'sourced', reviewed: 'October 15, 2026', where: BPLD_WHERE,
    description: 'Renewals are filed through eBPLS. Link your existing business using its Business ID Number, declare gross sales or receipts, and pay the assessed amount through the portal’s payment redirect.',
    eligibility: 'Businesses holding an Angeles City business permit. The current documents do not give a complete penalty schedule or annual renewal deadline.',
    requirements: ['Completed eApplication Form for renewal', 'Barangay clearance', 'Community Tax Certificate (cedula)', 'Fire Safety Inspection Certification (revision 33 of the paper form also lists BFP certification)', 'Tax-basis documents: previous-year income tax return or audited financial statement, quarterly BIR returns, or a certified sales breakdown for businesses with branches', 'Small businesses: previous year’s monthly breakdown of sales'],
    steps: ['Register in eBPLS, activate your account through email, and enter your Business ID Number to link your existing business.', 'Complete item 1 of the renewal application and upload scanned requirements in item 4.', 'Choose pickup or delivery of the original permit, then submit.', 'Monitor your registered email and upload any additional documents requested.', 'Check the portal’s billing statement and follow its redirect to Landbank Link.BizPortal to pay.', 'Print the electronic permit after approval and follow your pickup or delivery arrangement for the originals.'],
    fees: 'Depends on assessed gross receipts or capital and the city’s tax ordinance. A complete penalty schedule is not published in the current documents.',
    processing: 'Three working days, provided payment is made within that period (current eBPLS charter). The August one-day estimate is historical.',
    portal: { label: 'Continue to official eBPLS', href: LINKS.ebpls }, sources: permitSources, downloads: permitDownloads,
    related: ['business-permit-application', 'real-property-tax-payment'],
  }),
  mk({
    slug: 'health-id', category: 'health', title: 'City Health ID',
    summary: 'How to get a city Health ID, what to prepare, and where to continue on the official health card portal.', office: 'City Health Office',
    access: 'Online and walk-in', audience: ['Residents', 'Seniors', 'PWDs', 'Students'],
    description: 'The Health ID is issued through the city’s health card portal. This guide summarizes preparation; registration happens on the official site.',
    eligibility: 'Residents of Angeles City. Confirm any additional criteria on the portal.',
    requirements: ['Proof of residency', 'Valid ID or birth certificate', 'Recent photo if the portal requests one'],
    steps: ['Open the official Health ID portal.', 'Register and follow the on-screen instructions.', 'Bring the documents the portal lists if an office visit is required.'],
    portal: { label: 'Continue to official Health ID portal', href: LINKS.health }, sources: [{ label: 'City of Angeles Health Card', href: LINKS.health }],
    faqs: [{ q: 'Is the Health ID free?', a: 'This prototype sample does not state a fee. Check the official portal.' }], related: ['senior-citizen-id', 'pwd-id'],
  }),
  mk({ slug: 'birth-certificate-request', category: 'civil-documents', title: 'Birth certificate (local civil registry copy)', summary: 'Prepare to request a copy of a registered birth record.', office: 'City Civil Registry Office', access: 'Walk-in', audience: ['Residents'], related: ['marriage-certificate-request'] }),
  mk({ slug: 'marriage-certificate-request', category: 'civil-documents', title: 'Marriage certificate copy', summary: 'Requirements for requesting a copy of a registered marriage record.', office: 'City Civil Registry Office', access: 'Walk-in', audience: ['Residents'], related: ['birth-certificate-request'] }),
  mk({ slug: 'barangay-clearance', category: 'civil-documents', title: 'Barangay clearance', summary: 'Issued by your barangay; commonly required for permits and employment.', office: 'Barangay hall (your barangay)', access: 'Walk-in', audience: ['Residents', 'Businesses', 'Students'], related: ['business-permit-application'] }),
  mk({ slug: 'community-tax-certificate', category: 'taxes-and-fees', title: 'Community tax certificate (cedula)', summary: 'Get a community tax certificate for transactions requiring one.', office: 'City Treasurer’s Office', access: 'Walk-in', audience: ['Residents', 'Businesses'], related: ['real-property-tax-payment'] }),
  mk({ slug: 'real-property-tax-payment', category: 'taxes-and-fees', title: 'Real property tax payment', summary: 'Know what to prepare before paying real property tax.', office: 'City Treasurer’s Office', access: 'Walk-in', audience: ['Residents', 'Businesses'], related: ['community-tax-certificate'] }),
  mk({ slug: 'senior-citizen-id', category: 'social-welfare', title: 'Senior citizen ID', summary: 'Requirements to apply for a senior citizen ID.', office: 'Office of Senior Citizens Affairs (OSCA)', access: 'Walk-in', audience: ['Seniors'], related: ['pwd-id', 'health-id'] }),
  mk({ slug: 'pwd-id', category: 'social-welfare', title: 'Persons with disability (PWD) ID', summary: 'Requirements to apply for a PWD ID.', office: 'Persons with Disability Affairs Office (PDAO)', access: 'Walk-in', audience: ['PWDs'], related: ['senior-citizen-id', 'health-id'] }),
  mk({ slug: 'scholarship-assistance', category: 'education', title: 'Local scholarship assistance', summary: 'Where students can look for city scholarship information.', office: 'City Scholarship Office', access: 'Walk-in', audience: ['Students'] }),
  mk({ slug: 'building-permit', category: 'infrastructure', title: 'Building permit', summary: 'What to prepare for a building permit application.', office: 'City Engineering Office', access: 'Walk-in', audience: ['Residents', 'Businesses'], related: ['zoning-clearance'] }),
  mk({ slug: 'zoning-clearance', category: 'housing-and-land-use', title: 'Zoning clearance', summary: 'Check land-use compliance before a permit application.', office: 'City Planning and Development Office', access: 'Walk-in', audience: ['Residents', 'Businesses'], related: ['building-permit'] }),
]
export const sourceGaps = [
  { title: 'Fishpond and aquaculture registration', category: 'agriculture-and-fisheries' },
  { title: 'Garbage collection schedule by barangay', category: 'waste-disposal' },
  { title: 'Environmental compliance clearance', category: 'environment' },
  { title: 'Evacuation centre assignments', category: 'disaster-preparedness' },
  { title: 'Socialized housing application', category: 'housing-and-land-use' },
]
export const SUPPORTED_GUIDES = 42
export const SOURCE_GAPS = 17
export const offices = Array.from(new Set(services.map((s) => s.office))).sort()
export const audiences: Audience[] = ['Residents', 'Businesses', 'Students', 'Seniors', 'PWDs']
export const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug
export const serviceHref = (s: Service) => `/services/${s.category}/${s.slug}`
export const servicesFor = (office: string) => services.filter((s) => s.office === office)

export const barangayNames = ['Agapito del Rosario','Amsic','Anunas','Balibago','Capaya','Claro M. Recto','Cuayan','Cutcut','Cutud','Lourdes North West','Lourdes Sur','Lourdes Sur East','Malabanias','Margot','Mining','Ninoy Aquino (Marisol)','Pampang','Pandan','Pulung Bulu','Pulung Cacutud','Pulung Maragul','Salapungan','San Jose','San Nicolas','Santa Teresita','Santa Trinidad','Santo Cristo','Santo Domingo','Santo Rosario (Poblacion)','Sapalibutad','Sapangbato','Tabun','Virgen delos Remedios']
export const barangays = barangayNames.map((name, i) => ({ id: String(i + 1), slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''), name }))

export type DirType = 'Office' | 'Barangay' | 'Facility' | 'Official portal'
export type DirRecord = { id: string; type: DirType; name: string; description: string; address?: string; phone?: string; phoneVerified?: boolean; hours?: string; href?: string; asOf?: string; office?: string }
export const directory: DirRecord[] = [
  ...offices.filter((o) => !o.startsWith('Barangay')).map((o, i): DirRecord => ({ id: 'office-' + (i + 1), type: 'Office', name: o, office: o, description: `Responsible office for ${servicesFor(o).length === 1 ? 'one service guide' : servicesFor(o).length + ' service guides'}.`, asOf: 'Prototype sample' })),
  { id: 'portal-ebpls', type: 'Official portal', name: 'Business permit portal (eBPLS)', description: 'Official destination for business permit applications and renewals.', href: LINKS.ebpls },
  { id: 'portal-health', type: 'Official portal', name: 'Health ID portal', description: 'Official destination for the city Health ID.', href: LINKS.health },
  { id: 'portal-city', type: 'Official portal', name: 'Official city website', description: 'Angeles City Government website.', href: LINKS.city },
  ...barangays.map((b): DirRecord => ({ id: 'brgy-' + b.id, type: 'Barangay', name: 'Barangay ' + b.name, description: 'Barangay hall and local government unit.' })),
]
export const dirHref = (d: DirRecord) => d.type === 'Barangay' ? `/government/barangays/${d.id.replace('brgy-', '')}` : `/directory/${d.type.toLowerCase().replace(/\s+/g, '-')}/${d.id}`

export type TRecord = { id: string; title: string; type: string; amountType: string; amount?: string; period: string; refDate: string; source: string; sourceHref: string; note: string; illustrative?: boolean }
export const records: TRecord[] = [
  { id: 'annual-budget-sample', title: 'Annual budget document (sample entry)', type: 'Budget', amountType: 'Approved budget', period: 'FY sample', refDate: 'Not recorded', source: 'Official city website', sourceHref: LINKS.city, note: 'Amount not loaded in the prototype. The live collection holds dated, attributable records only.', illustrative: true },
  { id: 'award-sample', title: 'Notice of award (sample entry)', type: 'Procurement', amountType: 'Approved budget for the contract', period: 'FY sample', refDate: 'Not recorded', source: 'Official city website', sourceHref: LINKS.city, note: 'Approved budget for the contract is not a payment or an expenditure.', illustrative: true },
  { id: 'revenue-sample', title: 'Local revenue report (sample entry)', type: 'Revenue', amountType: 'Revenue', period: 'FY sample', refDate: 'Not recorded', source: 'Official city website', sourceHref: LINKS.city, note: 'Revenue is not comparable to budget figures.', illustrative: true },
  { id: 'project-sample', title: 'Infrastructure project record (sample entry)', type: 'Project', amountType: 'Reported project cost', period: 'FY sample', refDate: 'Not recorded', source: 'Official city website', sourceHref: LINKS.city, note: 'Completion status is not shown because no verified percentage is supplied.', illustrative: true },
  { id: 'expenditure-sample', title: 'Expenditure report (sample entry)', type: 'Expenditure', amountType: 'Expenditure', period: 'FY sample', refDate: 'Not recorded', source: 'Official city website', sourceHref: LINKS.city, note: 'No totals are computed across records.', illustrative: true },
]
export const recordGroups: { type: string; title: string; blurb: string; icon: string }[] = [
  { type: 'Budget', title: 'Budget', blurb: 'Approved appropriations by fiscal year.', icon: 'Landmark' },
  { type: 'Revenue', title: 'Revenue', blurb: 'Reported income from local and external sources.', icon: 'TrendingUp' },
  { type: 'Expenditure', title: 'Expenditures', blurb: 'Reported spending. Not comparable to budget figures.', icon: 'Wallet' },
  { type: 'Procurement', title: 'Procurement', blurb: 'Notices and awards. Contract budgets are not payments.', icon: 'Gavel' },
  { type: 'Project', title: 'Projects', blurb: 'Infrastructure project records with reported cost.', icon: 'Construction' },
]

export const mapLayers = [
  'Boundaries','Offices','Barangay halls','Health facilities','Police and fire stations','Schools','Tourism','Heritage','Jeepney routes','Terminals','Parking','Evacuation centres','Markets','Road closures','Flood-prone areas','Projects',
]
export const heritage = [
  { name: 'Holy Rosary Parish Church (Angeles)', note: 'Parish church in the Poblacion. Listed here as a place to verify; details to be sourced.' },
  { name: 'Museo ning Angeles', note: 'Local museum. Opening hours and exhibits to be confirmed with the museum.' },
  { name: 'Kapampangan food', note: 'Angeles is often associated with Kapampangan cuisine. Specific claims await citation.' },
]
export const quiz = [
  { q: 'Angeles City is located in which province?', options: ['Pampanga', 'Tarlac', 'Bulacan'], a: 0, why: 'Angeles is a city in Pampanga, Central Luzon. Source: PSA PSGC listing.', href: LINKS.psa },
  { q: 'How many barangays does Angeles City have?', options: ['33', '25', '48'], a: 0, why: 'The PSA PSGC lists 33 barangays for Angeles City.', href: LINKS.psa },
]
export const POPULATION = { value: '462,928', label: 'Population', note: '2020 Census of Population and Housing' }
