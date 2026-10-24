import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';

const directory = 'content/reference/angeles-city';
const review = `${directory}/refresh-2026-10-15`;
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) =>
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const crawl = json(`${review}/crawl.json`);
const baseline = json(`${review}/baseline-files.json`);
const manifest = json(`${directory}/source-manifest.json`);
const readSource = source => {
  const bytes = fs.readFileSync(source.file);
  return source.file_encoding === 'gzip' ? gunzipSync(bytes) : bytes;
};
const findSource = suffix => {
  const source = crawl.sources.find(item => item.url.endsWith(suffix));
  assert(source?.status === 200, `Missing successful source: ${suffix}`);
  return source;
};
const newsSource = pattern => {
  const source = crawl.sources.find(
    item =>
      item.reason === 'current-news' &&
      pattern.test(item.title.normalize('NFKC'))
  );
  assert(source?.status === 200, `Missing news source: ${pattern}`);
  return source;
};
const charter = findSource('/eBPLS-Citizen-Charter.pdf');
const form = findSource('/BPLD-ABP-001-Rev-33.pdf');
const download = source =>
  `/documents/angeles-updates-2026-10-15/${new URL(source.url).pathname.split('/').at(-1)}`;
const datasets = Object.fromEntries(
  manifest.datasets.map(dataset => [
    dataset.name,
    json(`${directory}/${dataset.name}.json`),
  ])
);

// Archive datasets remain intact. The effective collection overlays reviewed
// publications and adds news while retaining every unmatched August record.
const current = structuredClone(datasets);
const replacements = [];
for (const [slug, source, fields] of [
  [
    'issuance-of-business-permit-in-bpld',
    charter,
    {
      service_name: 'Issuance of eBusiness Permit',
      application_url: 'https://cityofangeles.ph/bpls/',
      source_url: 'https://angelescity.gov.ph/citizens-charter/',
      processing_time:
        'Three working days if payment is made within that period',
      new_requirements: [
        'eApplication Form',
        'DTI/SEC/CDA registration or legal personality',
        'Occupancy permit for constructed building',
        'Lease contract if applicable',
        'Barangay clearance',
        'Community Tax Certificate',
      ],
      renewal_requirements: [
        'eApplication Form',
        'Barangay clearance',
        'Community Tax Certificate',
        'Fire Safety Inspection Certification',
        'Applicable prior-year tax returns, audited statements, or sales breakdown',
      ],
      application_form_note:
        'Revision 33 additionally lists BFP certification for new applications. Its barangay-clearance exception differs from the charter; confirm the applicable checklist.',
      payment_method:
        'Landbank Link.BizPortal through the eBPLS billing statement',
      qa_checked_content_points: [
        'BPLD',
        'three working days',
        'gross receipts',
        'Landbank',
      ],
    },
  ],
  [
    'business-permit-form',
    form,
    {
      source_url: 'https://angelescity.gov.ph/',
      form_revision: 33,
      form_date: '2025-10-01',
      changes: [
        'BFP certification in both new and renewal checklists',
        'Government tax-incentive question',
      ],
      qa_checked_content_points: [
        'revision 33',
        'October 1, 2025',
        'BFP',
        'TIN',
      ],
    },
  ],
]) {
  const index = current.services.findIndex(
    item => item.source_service_slug === slug
  );
  assert(index >= 0);
  const previous = current.services[index];
  const sourceMetadata = {
    source_id: 'angeles_official_refresh_2026_10_15',
    publisher: 'Angeles City Government',
    url: source.url,
    retrieved_at: source.retrieved_at,
    priority: 100,
    content_hash: source.sha256,
    license: 'Public domain unless otherwise stated',
    license_url: 'https://angelescity.gov.ph/',
  };
  current.services[index] = {
    ...previous,
    ...fields,
    document_url: source.url,
    scraped_at: source.retrieved_at,
    source_id: sourceMetadata.source_id,
    source_content_hash: source.sha256,
    sources: [sourceMetadata, ...previous.sources],
    downloads: [download(source)],
    previous_publication: {
      source_url: previous.source_url,
      document_url: previous.document_url,
      scraped_at: previous.scraped_at,
      downloads: previous.downloads,
    },
    review_status: 'updated-verified-publication',
  };
  replacements.push({
    record: slug,
    old_document_url: previous.document_url,
    new_document_url: source.url,
    new_document_sha256: source.sha256,
    content_pages: previous.content_pages,
  });
}

const news = crawl.sources
  .filter(item => item.reason === 'current-news' && item.status === 200)
  .map(item => ({
    title: item.title.replace(/ - ACLGU$/, ''),
    display_title: item.title.normalize('NFKC').replace(/ - ACLGU$/, ''),
    url: item.url,
    published_date_iso: item.published_date?.slice(0, 10) || null,
    published_at: item.published_date,
    scraped_at: item.retrieved_at,
    source_url: 'https://angelescity.gov.ph/news/',
    source_id: 'angeles_official_refresh_2026_10_15',
    source_publisher: 'Angeles City Government',
    content_hash: item.sha256,
    evidence_text: item.text_file,
    review_status: 'newly-observed-since-local-snapshot',
  }));
const oldNewsUrls = new Set(current.news.map(item => item.url));
current.news.push(...news.filter(item => !oldNewsUrls.has(item.url)));
current.news.sort((a, b) =>
  (b.published_date_iso || '').localeCompare(a.published_date_iso || '')
);

const councilSource = findSource('/city-council/');
const councilText = fs.readFileSync(councilSource.text_file, 'utf8');
const councilLines = councilText.split('\n');
const officialCouncil = [];
for (let i = 0; i < councilLines.length; i++) {
  if (councilLines[i] === 'CITY COUNCILOR') {
    officialCouncil.push({
      name: councilLines[i - 1].replace(/^Hon\.\s*(?:Atty\.\s*|Dr\.\s*)?/, ''),
      position: 'City Councilor',
    });
  }
}
assert.equal(officialCouncil.length, 10);
const councilLabels = [
  'Amos Rivera',
  'Arvin Suller',
  'Joan Crystal Aguas',
  'Marino Bañola',
  'Maricel Morales-Agoncillo',
  'Edgardo Pamintuan Jr.',
  'Jezreel Aaron Pineda',
  'Michelle Bonifacio',
  'Alexander Indiongco',
  'Jeselle Dayrit',
  'Raco Paolo Del Rosario',
];
current.council = current.council.map((record, index) => ({
  ...record,
  ...(index < 11
    ? {
        official_display_name: councilLabels[index],
        current_source_url: councilSource.url,
        checked_at: councilSource.retrieved_at,
        review_status:
          index === 6
            ? 'name-label-discrepancy-no-officeholder-change-inferred'
            : 'published-with-shortened-or-matching-name',
      }
    : { review_status: 'retained-not-republished-on-current-council-page' }),
}));

const events = crawl.sources
  .filter(
    item =>
      item.reason === 'current-event' &&
      item.status === 200 &&
      new URL(item.url).pathname.startsWith('/event/')
  )
  .map(source => {
    const html = readSource(source).toString('utf8');
    const text = fs.readFileSync(source.text_file, 'utf8');
    const schemas = [
      ...html.matchAll(
        /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
      ),
    ].flatMap(([, value]) => {
      try {
        const parsed = JSON.parse(value);
        return parsed['@graph'] || [parsed];
      } catch {
        return [];
      }
    });
    const event =
      schemas.find(item => String(item['@type']).includes('Event')) || {};
    return {
      name: source.title.replace(/ - ACLGU$/, ''),
      url: source.url,
      source_schema_start_date: event.startDate || null,
      source_schema_end_date: event.endDate || null,
      displayed_schedule: text
        .split('Transparency\n')
        .at(-1)
        .split('Share on Facebook')[0]
        .trim(),
      schedule_note:
        'Schema timezone offsets differ across city events. Preserve the original values; use the displayed local schedule and confirm with the organizer rather than converting these schema timestamps.',
      location_name:
        event.location?.name?.replace(/&#(\d+);/g, (_, n) =>
          String.fromCodePoint(Number(n))
        ) || null,
      status_at_review: text.includes('This event has passed.')
        ? 'past'
        : 'upcoming',
      retrieved_at: source.retrieved_at,
      content_hash: source.sha256,
      evidence_text: source.text_file,
    };
  });
writeJson(`${review}/current-records.json`, {
  reviewed_on: crawl.review_date,
  policy:
    'Verified service publications replace the effective record. Missing records and baseline source files are retained. Council name-label discrepancies do not establish a change of person. News and events are dated reports, not application entitlements.',
  datasets: current,
  government: {
    mayor: {
      name: 'Carmelo “Jon” B. Lazatin II',
      source_url: 'https://angelescity.gov.ph/angeles-city-mayor/',
    },
    official_council_listing: [
      { name: 'Amos Rivera', position: 'Vice Mayor / Presiding Officer' },
      ...officialCouncil,
    ],
  },
  events,
});

const changedFiles = baseline
  .filter(
    item =>
      fs.existsSync(item.file) &&
      hash(fs.readFileSync(item.file)) !== item.sha256
  )
  .map(item => item.file);
const archivedChecks = crawl.sources.filter(
  item => item.reason === 'august-document'
);
const changes = {
  reviewed_on: crawl.review_date,
  checked_source_count: crawl.sources.length,
  updated_service_records: replacements,
  retained_service_records: current.services.length - replacements.length,
  new_news_records: news.length,
  new_event_records: events.length,
  unavailable_august_document_urls: archivedChecks.filter(
    item => item.status === 404
  ).length,
  preserved_august_document_downloads: manifest.documents.length,
  council_name_discrepancy: {
    saved_name: 'Aaron L. Pineda',
    published_name: 'Jezreel Aaron Pineda',
    action: 'retain both labels; no officeholder change inferred',
  },
  retained_unlisted_council_records: current.council
    .slice(11)
    .map(item => item.name),
  unchanged_datasets: ['barangays', 'schools', 'tourism'],
  changed_existing_files: changedFiles,
  new_government_pages: [
    'content/government/departments/legislative.md',
    'content/government/departments/office-schedules.md',
  ],
};
writeJson(`${review}/changes.json`, changes);

const schedule = newsSource(/ADJUSTED WORK SCHEDULE/);
const rabies = newsSource(/FREE RABIES VACCINATION/);
const immunization = newsSource(/School-Based Immunization/);
const welfare = newsSource(/Social Welfare Assistance/);
const cinema = newsSource(/LIBRENG SINE/);
const fame = newsSource(/Manila FAME/);
const rows = news
  .sort((a, b) => (b.published_at || '').localeCompare(a.published_at || ''))
  .map(
    item =>
      `| ${item.published_date_iso || 'Not supplied'} | [${item.display_title.replaceAll('|', '\\|')}](${item.url}) |`
  )
  .join('\n');
const report = `# Angeles City website refresh — October 15, 2026

Compared the working repository's August 9–11, 2026 reference data with the official city website. Checked **${crawl.sources.length} source URLs**, including all **47 old PDF URLs**, all **18 pages in the page sitemap**, the **42 news articles modified since the August snapshot**, the event sitemap and its listed pages, and the tourism directory and four attraction pages. Sitemap modification dates selected news for review; article publication dates are stored separately.

This is a comparison with the local saved records, not a complete historical copy of every August webpage. “New” means newly observed against that local snapshot. No record was deleted because its replacement page was missing, empty, or unavailable.

## Confirmed changes applied

| Area | August/local value | Current official publication and action |
| --- | --- | --- |
| Business permit form | Revision 30, September 1, 2023 | [Revision 33, October 1, 2025](${form.url}); added BFP certification for new and renewal applications and a government tax-incentive question. Replaced the primary download in all three business guides; kept revision 30 as an archive. The URL's October 2026 upload folder is not the form revision date. |
| Business permit procedure | Walk-in BOSS; two days for new applications, one day for renewal without inspection | [eBPLS charter](${charter.url}); email activation, scanned uploads, Business ID linkage for renewal, Landbank online payment, electronic permit, pickup/delivery of originals, and three working days if payment is made within that period. These timelines describe different channels; no like-for-like slowdown is inferred. |
| Renewal evidence | Shorter tax-basis checklist in the saved form | Current charter lists FSIC and alternative prior-year tax/financial records or sales breakdowns. Current form also lists BFP certification. Preserved the form/charter disagreement about when barangay clearance is needed. |
| City Hall workweek | Older charters printed Monday–Friday, 8 a.m.–5 p.m. | [October 15 advisory](${schedule.url}) describes Monday–Thursday compressed workweeks and eight-hour days on October 19–22. Added a shared schedule page and notices to affected service guides. Exact new opening/closing times were not published; clinic and essential-service hours are not inferred. |
| Executive content | The app still had Lapu-Lapu sample names: Ma. Cynthia K. Chan and Celedonio B. Sitoy | Corrected the app to Angeles Mayor Carmelo “Jon” B. Lazatin II and Vice Mayor Amos Rivera (saved fuller name Amos B. Rivera), using the [mayor profile](https://angelescity.gov.ph/angeles-city-mayor/) and [council page](${councilSource.url}). The saved Angeles roster already had the correct mayor; this is a sample-content correction, not a new mayor. |
| Council labels | Aaron L. Pineda | Current council page displays Jezreel Aaron Pineda. Kept both labels and flagged the discrepancy, without claiming a change of person. Most other current names omit middle initials or shorten existing labels. Added a working council page. |
| Vaccination | Saved RHU immunization/consultation charters | Added [school-based immunization](${immunization.url}) coordination and the [October 5 anti-rabies announcement](${rabies.url}): human vaccination at the Animal Bite Treatment Center, City Hall, Mondays and Thursdays; pet vaccination through the City Veterinary Office. No school vaccine/grade/consent schedule or new clinic opening hours were invented. |
| Social and education assistance | Saved assessment procedure; no current disbursement report | Added the [October 7 CSWDO report](${welfare.url}): ₱1,000 to each of 505 solo parents; ₱3,000 to each of 11 college students who are children of solo parents and 25 youth beneficiaries; ₱10,000 to each of 18 calamity victims; ₱3,000–₱5,000 to four special-protection beneficiaries. These are reported past payments, not promised awards or an open application. |
| Senior cinema access | No equivalent current benefit in the page | Added the [October 5 OSCA announcement](${cinema.url}): registered Angeles seniors, Senior ID, SM City Clark/Marquee Mall, Mondays/Tuesdays, noon–5 p.m. The article's dated film list includes an inconsistent 11 a.m. show; current times must be confirmed. |
| Tourism and trade events | Four attraction references, no current event examples | Added [TTKD, October 23–24](https://angelescity.gov.ph/event/tigtigan-terakan-keng-dalan-festival-ttkd-2026/), [Apung Mamacalulu, October 30](https://angelescity.gov.ph/event/apung-mamacalulu/), and [Manila FAME, October 15–17](${fame.url}). No open exhibitor applications or booth fees were inferred. |

## Kept because no verified replacement was found

- **37 of 39 service reference records** retain their original publications and procedural details. New announcements supplement relevant guides without replacing their unrevised checklists or charges.
- **All 47 August PDF reading copies** remain unchanged. All 47 original official document URLs returned **404** during this review. The current charter page publishes only the eBPLS charter; unavailable civil-registry, building, tax, welfare and health documents were not treated as withdrawn services.
- **All 33 barangays** remain. The old city barangay index returns 404, and the current page sitemap contains no replacement barangay directory. This review does not reconfirm individual barangay addresses or officers.
- **All 52 school records** remain. Their source is the separate DepEd dashboard; this city-website review does not claim to re-scrape or reconfirm DepEd data.
- **All four tourism attractions** remain. The current tourist-spot index and the four linked pages still identify the same destinations. Display capitalization and punctuation changes do not establish new attractions.
- **Danilo Nacu (ABC)** and **Richard Dela Cruz-Gaza Jr. (SK)** remain from the supplied council roster. The new council page lists only the vice mayor and ten city councilors; omission is not evidence of a departure.
- **All five old news records** remain, alongside **42 newly observed articles**. No archived headline was replaced by an unrelated new article.
- No example New York/Phoenix address, 555 telephone number, example email, or generic “About” team member was imported. Those live pages contain template content. Empty profile/forms/documents pages did not override saved data.

## Source files and review artifacts

- [Effective current records](${review}/current-records.json): all six baseline datasets, two verified service-publication replacements, current council display labels, 42 added news records, and ${events.length} successfully read event records. The two missing sectoral labels retain their prior names and status.
- [Machine-readable changes](${review}/changes.json) and [crawl status, hashes and links](${review}/crawl.json).
- [Original file hashes](${review}/baseline-files.json) and the \`before/\` directory preserve the working content before this refresh, including your pre-existing local edits.
- New public downloads: [revision 33 form](public${download(form)}) and [eBPLS charter](public${download(charter)}). They are byte-for-byte copies of the official downloads, with SHA-256 hashes in the crawl and changes data.
- The original six JSON datasets, government YAML, source manifest and 47 PDFs remain the immutable August baseline. No reference/audit data is imported into the app bundle. Visible updated content remains under \`content/services/\` and \`content/government/\`.
- Recollect evidence with \`node scripts/refresh-angeles-sources.mjs\`; summarize the reviewed October decisions with \`node scripts/summarize-angeles-review.mjs\`. The collector resumes an existing review folder. Use a new date argument for a fresh collection; the summary script records this specific October review's editorial decisions.

## Newly observed news

| Publication date | Official article |
| --- | --- |
${rows}

## File changes in this refresh

${changedFiles.map(file => `- [${file}](${file})`).join('\n')}
- [New council page](content/government/departments/legislative.md)
- [New office schedule page](content/government/departments/office-schedules.md)

The city event schema uses inconsistent timezone offsets. Event records preserve the original schema values and the displayed schedule separately; no converted local event times are inferred from those offsets.

Validation results are recorded in \`${review}/verification.json\` after running the content checks and production build.
`;
fs.writeFileSync('CONTENT-UPDATE-2026-10-15.md', report);
console.log(
  `Summarized ${replacements.length} service replacements, ${news.length} added news records, ${events.length} events, and ${changedFiles.length} changed existing files.`
);
