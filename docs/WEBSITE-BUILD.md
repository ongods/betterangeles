# BetterAngeles website build

Implemented 20 November 2026 from `betterangeles_website_build_prompt.md`.
This is a local community guide, not an official city transaction system.

## What works

The seven primary destinations are Home, About, Services, Government,
Transparency, Interactive Map, and Contact & Help. Existing document routes and
archives remain available. The service journey supports text, topic, category,
access, office, and audience filters; guide pages retain dated instructions and
link to the official business and Health ID portals. Unknown fees and hours are
explicit. There are 42 supported guides and 17 recorded source gaps.

Government includes executive and legislative documents, office listings, and
33 searchable barangays with detail routes, PSGC identifiers, census reference
dates, and qualified 2023–2026 officials-sheet entries. Unverified telephone
values are text only. Directory records also have stable detail routes.

Transparency has six searchable records with detail pages. Revenue, approved
contract budget, extract amounts, and reported project cost remain separate;
there is no invented total, award, expenditure, or progress percentage.

The Leaflet map uses an attributed OpenStreetMap basemap and 80 searchable text
records. All 16 proposed layers expose their actual availability. No facility
coordinates have been validated, so no markers, directions, route lines, hazard
polygons, or nearby-distance claims are shown. Manual location and opt-in browser
location are supported; location remains in memory for the current visit.
List-only mode and tile-error recovery preserve discovery without a working map.

Home reuses the official calendar/news adapters, with independent errors and
real retrieval timestamps. Expired, cancelled, or postponed events are not
featured as upcoming. News is not treated as an active emergency warning.
About includes sourced heritage context and a three-question quiz with cited
explanations. Weather displays an unavailable state and an official PAGASA link.

## Design and references

The existing Kapwa blue/white identity, Inter typography, navigation, and shared
UI primitives are extended. BetterSolano informed task-oriented service
discovery, office grouping, and financial period/source labels; BetterLocalGov
informed reuse of the incumbent template. The supplied Google Doc's layout and
comments informed navigation and coverage. Other city references contributed no
Angeles facts. Authentic local imagery was not available with established reuse
rights, so no unrelated or generated historical photographs were substituted.

## Preview and checks

Use the Node version in `.nvmrc`, install with `npm ci`, then run `npm run dev`.
The verified local address is `http://127.0.0.1:5173/` (the command may choose
another port if it is occupied). Nothing was deployed or published.

Run `npm run check:ci` for formatting, lint, types, regression tests, production
build, source QA, and built-content QA. Browser evidence is generated locally in
the ignored `.impeccable/review/` directory. Checks cover desktop and narrow-phone
routes, combined filters, no results, menu and skip-link keyboard behavior,
qualified contacts, the quiz, and simulated feed/tile failures. These checks do
not certify complete accessibility conformance or current government records.

Validation on 20 November 2026: `npm run check:ci` passed with 50 tests.
The desktop/phone browser suite passed 65 checks with no uncaught exceptions;
seven additional assertions verified mobile table source links, column alignment,
table/list switching, and not-applicable document amounts. The independent
finish reviewer scored both requested corrections resolved (ship disposition
for those fixes). The main JavaScript chunk is approximately 488 kB before gzip;
the document renderer and Leaflet are loaded separately.

## Updating records

1. Save a new dated source snapshot under `content/reference/angeles-city`.
   Preserve old snapshots byte-for-byte and record the publisher, URL, document
   date, retrieval date, page/row locator, and qualifications. Never import this
   evidence tree into application code.
2. Reconcile the source into the relevant curated dataset below. Preserve the
   source-reported status separately from a time-derived display label. Missing
   values remain unknown/not retrieved/not applicable as appropriate, never zero
   or confirmed none without evidence.
3. Add or update focused behavior tests when interpretation changes. Run
   `npm run check:ci` and inspect the affected page at desktop and phone widths.

| Content                                           | Editable location                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| Service guides and category indexes               | `content/services/`, `src/data/services.yaml`, `src/data/yamlLoader.ts` |
| Service search, portal links, facts and FAQs      | `src/data/serviceMetadata.ts`                                           |
| Government documents                              | `content/government/`                                                   |
| Census, directory, heritage and source registry   | `src/data/angeles.json`                                                 |
| Dated barangay officials and source rows          | `src/data/barangayOfficials.json`                                       |
| Financial/procurement/project records and context | `src/data/transparency.ts`                                              |
| Map inventory and source-gated positions          | `src/data/map.ts`, `src/types/records.ts`                               |
| Quiz questions and citations                      | `src/data/heritageQuiz.ts`                                              |
| Feed providers and normalization                  | `src/lib/cityFeed.ts`                                                   |
| Feed refresh and failure handling                 | `src/hooks/useCityFeeds.ts`                                             |
| Help and publication policy                       | `content/government/city-guide/contact.md`                              |

The offline `scripts/import-barangay-officials.mjs` reproduces the saved sheet
transcription; it is not a live sync. Review its output before replacing editorial
changes. The supplied workbook was checked on 19 November 2026, but its issuer
and publication date remain unconfirmed and it does not verify current tenure.

For new map positions, supply source URL, checked date, and validation state per
coordinate. Only `validated` coordinates with finite, in-range latitude/longitude
and provenance pass the marker/directions gate. Add appropriate schema and
validation before enabling line/polygon layers. Do not geocode ambiguous names
and silently promote the result. Tile URL and attribution can be configured with
`VITE_MAP_TILE_URL` and `VITE_MAP_ATTRIBUTION`; preserve provider attribution,
licensing, and usage-policy requirements. Vite environment values are public.

## Outstanding evidence and integrations

Current officeholders and telephone contacts need authoritative confirmation.
The full annual budget, audit contents, awards/contracts, current project
progress, facility positions, boundaries, jeepney routes/fares, and hazard data
are pending. Weather and active-alert providers, a city concern-submission
destination, and reviewed translations are not connected. Dictionary/Kulitan
material and some service details lack reviewed sources. Source gaps limit the
corresponding claims and actions, not access to the supported records.

Official feed and map availability depends on external providers. Historical
source dates and differing form/charter requirements remain visible. The health
portal and its pregnancy advisory were checked on 19 November 2026; users still
need the issuing office to confirm their applicable requirements.
