# BetterAngeles roadmap

Planning baseline: 7 November 2026. Status: proposed delivery plan.

Implementation has started using the currently available sources. See
[implementation status](IMPLEMENTATION-STATUS.md) for delivered behavior,
reconciliation decisions, and remaining requirements for each milestone.

Build a useful public beta around service discovery, readable guides, and
traceable city information. Expand into directories, transparency, maps, and
live content as their source data becomes suitable for publication.

## Basis and scope

This roadmap turns the [BetterAngeles planning document][planning-doc] into
delivery milestones. Its four tabs serve different purposes:

- **References:** project links and existing official transaction portals.
- **layout:** proposed navigation, page sections, search, and map features.
- **data gathering:** agencies and offices from which to obtain information.
- **Scraped website data:** an extraction dated 28 October 2026, with evidence
  labels, unresolved conflicts, and a source register.

The extraction reports **18 partial categories, one missing category, and one
requiring verification** across its 20 subject areas. These describe that
document's coverage, not the application's implementation status. Its complete
source register also does not mean every linked dataset was retrieved.

The document and repository are complementary. This plan compares both; it does
not certify every scraped statement as current. A spot check of the
[PSA Angeles page][psa] supports the proposed population and barangay baseline.
The [city council page][council] currently exposes an image in its readable text,
which helps explain the newer extraction's roster gap. Other currency and
completeness checks remain explicit work below.

Dates in this roadmap are relative to implementation kickoff. Suggested owners
are roles to assign, not confirmed people or commitments. Effort assumes one
developer with regular content-review support; office responses can extend any
milestone. The deliverable here is a plan, without changing published content or
the source Google Doc.

## What is already built

| Area                     | Repository baseline                                                                                 | Roadmap consequence                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Application              | React, TypeScript, Vite, shared UI, service/government routes, Markdown/YAML loaders                | Extend the existing application and loaders.                                                                |
| Services                 | 42 Markdown pages; 17 indexed drafts documented as missing source content                           | Review existing guides and resolve the missing-page experience before adding breadth.                       |
| Source preservation      | 146 baseline reference records, 47 archived service PDFs, and October refresh evidence              | Preserve archives and provenance; unavailable live sources do not erase saved evidence.                     |
| Government               | Executive, legislative, and dated office-schedule pages                                             | Reconcile their evidence with the newer document instead of rebuilding from zero.                           |
| Directories              | A 33-barangay link directory and 52 DepEd school records                                            | Enrich these records using stable identifiers; the document's smaller school sample is additional evidence. |
| Discovery                | Category browsing; the hero has no working search                                                   | Prioritize an index of published services and useful filters.                                               |
| Information architecture | Primary navigation has Services and Government; footer includes starter links                       | Implement the proposed sections incrementally and verify every exposed destination.                         |
| Languages                | i18next infrastructure; only English translation resources exist                                    | Ship reviewed English first, then add languages with actual content coverage.                               |
| Integrations             | Saved event/iCalendar/Windy probes from 15 October; no implemented feed in the reviewed application | Treat probes as experiments, with fresh production checks before integration.                               |
| Quality                  | Formatting, lint, types, loader tests, content QA, production-build QA                              | Preserve these checks and add focused coverage when behavior changes.                                       |

Counts describe the inspected repository, not verified current citywide coverage.
See the [development guide](DEVELOPMENT.md),
[source manifest](../content/reference/angeles-city/source-manifest.json), and
[October review](../content/reference/angeles-city/refresh-2026-10-15/verification.json).

## Decisions that shape delivery

1. **Treat scraped material as evidence awaiting editorial judgment.** Separate
   coverage, verification, and publication status. A recently retrieved page may
   contain an old procedure or placeholder content.
2. **Launch a bounded set of useful journeys.** Initial candidates are business
   permits, civil documents, health IDs, local taxes, and finding an office or
   barangay. Confirm priority with residents; confirmation of service details
   remains necessary before presenting them as current instructions.
3. **Keep applications in official systems.** BetterAngeles explains preparation
   and links to eBPLS or Health ID appointments. Account creation, payments,
   application tracking, and appointment booking remain official-portal links
   unless a separate integration is supported and scoped.
4. **Publish sections when their content supports them.** The target navigation
   is Home, About Angeles, Services, Government, Transparency, Interactive Map,
   and Contact & Help. A beta can launch with fewer sections; unavailable
   sections must not become empty or broken destinations.
5. **Make ownership clear.** Confirm the site's operator, domain, and affiliation.
   Until official operation is established, replace inherited claims such as
   “Official Government Website” with accurate community-project wording.

## Milestones

Completed tasks and completed portions of a task are crossed out. Milestone
headings remain open while their remaining requirements are unfinished.

| Milestone                        | Indicative window | Deliverable                                                                                    | Prerequisite                                               |
| -------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| M0: Reconcile evidence           | Week 1            | Publication inventory, conflict register, bounded beta scope                                   | Repository and planning document                           |
| M1: Useful public beta           | Weeks 2–4         | Service search, reviewed priority guides, useful home page, government summary, Contact & Help | M0 publication decisions                                   |
| M2: City and directory coverage  | Weeks 5–6         | About Angeles, enriched barangays/offices/facilities, reviewed language pilot                  | Stable identifiers and reviewed source records             |
| M3: Transparency library         | Weeks 7–8         | Searchable dated documents and limited project records                                         | Accessible financial/procurement evidence                  |
| M4: Location discovery           | Weeks 9–11        | Accessible map and equivalent list of verified locations                                       | M2 location records and map-data review                    |
| M5: Maintained feeds and culture | Week 12 onward    | Supported announcements/events/weather; reviewed cultural features                             | Named maintainers, source access, and refresh arrangements |

M2–M5 can move independently after their prerequisites are satisfied. Request
GIS, financial, directory, and transport records during M0 so response times do
not postpone the beta. The map and live integrations are not beta dependencies.

### M0: Reconcile evidence and agree the publication boundary

Suggested lead: content editor, with developer support.

- Create a field-level inventory linking the planning document's S01–S56
  references to existing records, guides, PDFs, and refresh snapshots. Use
  namespaced source IDs so the document's IDs cannot collide with repository IDs.
- Classify each existing page as ready, publishable with dated limitations, or
  held for confirmation. Review the 17 missing drafts individually; remove
  misleading links or provide an honest unavailable-information state until
  evidence supports a guide. Preserve the recorded source gaps.
- Resolve conflicts in a small decision register: competing values, source
  dates, affected pages, responsible reviewer, and resolution or remaining gap.
- Record the site's operator, publication owner, correction channel, and initial
  resident tasks. Request source files through the relevant offices as future
  project work; this roadmap does not send those requests.

**Exit criteria:** every existing service page and indexed gap has a disposition;
each launch-blocking conflict has either supporting evidence or a limited public
presentation; source archives remain intact; the beta task list has an owner.

### M1: Ship service discovery and a trustworthy public beta

Suggested leads: developer and content editor.

- ~~Add a search index from curated, published content using title,
  description, category, and reviewed synonyms.~~
- ~~Add category and supported online-application-link filters.~~ Add walk-in
  filters when those fields are verified; introduce office and audience filters
  as coverage improves. Unknown metadata must not become a guessed classification.
- Standardize the priority guides around description, eligibility, requirements,
  steps, fees, turnaround, responsible office, location, contacts, forms, online
  links, and source/review dates. Include FAQs only where answers are supported.
  State missing fields clearly; historical charter figures retain their dates.
- Make the home page useful: service search, reviewed quick links, a concise city
  snapshot, and links to available government/help content. Keep unsupported
  weather, mini-map, event, and project modules out of the launch requirement.
- Build Contact & Help with verified office destinations, an explanation of site
  ownership, and a working correction path. Separate website corrections from
  official service transactions and urgent assistance.
- Audit branding, SEO, navbar, footer, and generic document routes. Existing
  `/:documentSlug` routes reach a viewer that requires category information; a
  route declaration alone does not make `/about` or `/accessibility` work. Add
  explicit supported routes or correct their links and provide a useful 404.

**Exit criteria:** each selected resident journey reaches a reviewed guide and
working official destination; search handles spelling variants, empty results,
and filter resets; no exposed navigation leads to a missing draft. Check keyboard
operation, readable mobile layouts, focus states, zoom, and assistive labels in
a browser. `npm run check:ci` passes, with existing limitations recorded.

### M2: Add About Angeles and useful directories

Suggested leads: content editor and developer; relevant offices supply records.

- Build About Angeles from dated city statistics, an original sourced history,
  barangay overview, and tourism/heritage summaries. Keep reference years beside
  figures and identify any derived calculations and their input basis.
- ~~Join barangays by PSGC and schools by official school ID. Preserve aliases
  and raw spellings.~~ Add contacts, addresses, services, and map-ready coordinates
  only after review. Publish partial directory coverage honestly.
- Enrich government offices and officials with mandate, role, term/as-of date,
  contact provenance, and related services. Distinguish local departments from
  national agency references inherited from the template.
- Add public/private school and health-facility details as distinct datasets;
  a school dashboard record or TB-program listing does not establish complete
  accreditation, available enrollment, or a full hospital directory.
- Pilot Filipino UI and selected high-priority guides with a reviewer. Plan
  Kapampangan content with a qualified language reviewer. Show actual language
  availability and retain an understandable fallback for untranslated pages.

**Exit criteria:** all 33 barangays have unique canonical identifiers; each
published contact and facility entry has attributable evidence and a review
date; missing addresses and coordinates stay missing. The language pilot covers
complete selected journeys, including errors and help text.

### M3: Publish a transparency library before a financial dashboard

Suggested leads: transparency editor and developer.

- Organize budget, investment-plan, procurement, financial-statement, audit, and
  disclosure documents by type, fiscal year, issuer, and publication date.
  Display coverage gaps instead of implying a complete annual collection.
- Preserve accessible source files and stable links where reuse permits, with
  provenance and readable summaries. Portal leads and blocked search extracts
  stay in the acquisition backlog until the underlying evidence is obtained.
- Create project records only for attributable fields. Keep approved budget,
  approved budget for the contract (ABC), award value, disbursement, and final
  cost separate. Store project dates and progress with their own evidence dates.
- Add charts only after comparable, sufficiently complete series exist. Record
  source-reported procurement status separately from inferred date state; an old
  “Active” label does not establish that bidding is still open.

**Exit criteria:** each displayed document/amount is traceable and correctly
labeled; unavailable years and missing project fields remain visible; historical
announcements are not shown as verified current completion or expenditure.

### M4: Add location discovery in layers

Suggested leads: developer and GIS/data reviewer.

- Start with reviewed points for offices, barangay halls, health facilities,
  schools, markets, and heritage places. Provide location search, layer filters,
  detail panels, external directions, and ~~an equivalent searchable list~~.
- Offer nearby discovery only when useful coordinates exist; request location
  access after a user action and support manual location selection.
- Add barangay/city boundaries and zoning only after obtaining geographic files
  with source, edition, coordinate reference system, coverage, and reuse terms.
  Record positional uncertainty; do not infer boundaries from place names.
- Treat hazards, evacuation facilities, road closures, and project geometry as
  separately reviewed layers. A listed evacuation building is not necessarily
  activated or safe to reach. Each time-sensitive layer needs an update owner
  and expiry/as-of policy before publication.
- Keep jeepney routes behind ACTDO/LTFRB confirmation and field checks in both
  directions. Route names/colors cannot supply paths, stops, fares, or schedules.
  Add parking and terminals only when their underlying records are verified.
- Defer location-based concern submission until there is a receiving operator,
  response process, and clear handling of submitted locations and personal data.

**Exit criteria:** every rendered feature has reviewed geometry and source
metadata; list navigation works without the map or geolocation; missing layers
are explained; transport and hazard layers meet their separate publication gates.

### M5: Add maintained feeds and cultural features

Suggested leads: integration developer, publishing editor, and cultural reviewer.

- ~~Replace the static event archive with the official city's calendar and
  latest-news APIs, refreshing on page visit, every five minutes while visible,
  and on return to the page. Add manual refresh and independent failure states.~~
- Begin announcements and events with reviewed entries and source links. Add
  automation only after verifying access, reuse terms, production behavior, and
  refresh responsibility. Do not depend on automatic Facebook scraping; evaluate
  a supported connection if available and retain an editorial fallback.
- ~~Verify the current calendar/news endpoints and cross-origin reads with
  live browser requests.~~ Recheck iCalendar separately if it is needed later;
  an upstream policy change must retain the failure state and official-site links.
- ~~Add validation, deduplication, 15-second timeouts, cancellation, last-success
  timestamps, stale presentation, and independent source failure/retry behavior
  for the calendar and news feeds.~~ Apply the same checks to future feeds.
  Expire alerts rather than serving old suspension notices as active warnings.
- For weather, begin with official PAGASA destinations. Add readings/forecasts
  only after identifying a supported source and its refresh rules. Show station
  or geographic coverage, units, observation/forecast type, issue time, and
  validity. The saved Windy embed test alone is insufficient evidence for a live
  official-weather feature.
- ~~Add sourced Angeles tourism highlights.~~ The quiz was removed from scope
  at the user's request. Treat a mini-dictionary and Kulitan material
  as separate editorial projects needing actual reusable entries, attribution,
  and specialist review; a translator interface is not an extracted dictionary.

**Exit criteria:** simulated source failure and stale data produce understandable
fallbacks; expired events/alerts leave current views automatically; each enabled
feed and cultural dataset has a maintainer and review procedure.

## Evidence conflicts to resolve first

| Conflict                                                                                                        | Required treatment                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Document says current council names are missing; repository has an October legislative page and supplied roster | Compare saved evidence, the current image, and a dated SP roster. Retain source-specific names and distinguish sectoral representatives without assuming appointments.                                       |
| Document lacks citywide service procedures; repository contains archived charters and guides                    | Review each archived procedure's scope and currency. Merge evidence by service rather than replacing supported guides with blanket “missing” claims.                                                         |
| Document lists a public-school sample; repository already holds 52 records                                      | Join by school ID, enrich with address evidence, and preserve differences and source dates. Neither count proves a complete current inventory.                                                               |
| Old city statistics versus the document's PSA baseline                                                          | Use the PSA census reference year and geographic edition; retain older values only as explicitly historical series.                                                                                          |
| Business charter and revision 33 form have different conditions                                                 | Preserve both checklists and seek BPLD clarification before presenting a single definitive requirement list.                                                                                                 |
| Portal/archived Monday–Friday hours versus the October workweek advisory                                        | Obtain office-specific current hours; do not extend a dated October exception indefinitely.                                                                                                                  |
| Barangay workbook has an unknown issuer/date and a 2023–2026 term label                                         | Obtain the original workbook and provenance; keep row references. Confirm official contact ownership, malformed numbers, and appointment currency. Do not relabel other officials' numbers as captain lines. |
| Document calls 30 October an upcoming event                                                                     | As of this roadmap's 7 November baseline that date has passed. Calculate current/past state at display time and reconcile source timezone inconsistencies.                                                   |
| Historical assistance payouts, revenue, procurement, and project announcements                                  | Preserve amount type and reference period. They do not establish current eligibility, annual budgets, actual spend, or project completion.                                                                   |

## Data acquisition and feature gates

The status column below reproduces the planning document's category assessment.
“Phase” indicates the earliest useful delivery, subject to the stated evidence.
Office names identify proposed source counterparts, not promises of access.

| Subject               | Document status    | Next evidence or review                                                                           | Phase                            |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------- |
| City profile          | Partial            | PSA records and CPDO indicators; align census, household, and land-area reference years           | M1 snapshot; M2 profile          |
| Barangays             | Partial            | PSGC joins, original officials workbook, verified hall contacts/addresses via Barangay Affairs    | M2                               |
| History               | Partial            | ACTO/CKS/NHCP timeline and resolution of conflicting historical accounts                          | M2                               |
| Officials             | Partial            | Saved council evidence plus a dated SP/HRMO roster and term labels                                | M0 reconciliation; M1 summary    |
| Departments           | Partial            | HRMO/office directory with mandates, contacts, heads, and actual transaction hours                | M1 essentials; M2 expansion      |
| Government services   | Partial            | Match archived procedures against latest charters and each responsible office; review all 17 gaps | M0–M2                            |
| Business and taxes    | Partial            | BPLD checklist reconciliation; Treasurer/Assessor current schedules and forms                     | M1                               |
| Health                | Partial            | CHO/EHS checklist and hours; DOH facility records with appropriate scope                          | M1 guides; M2 directory          |
| Education             | Partial            | Join saved IDs to DepEd addresses and current school-year authority/coverage                      | M2                               |
| Social services       | Partial            | CSWDO eligibility, windows, requirements, and application contacts                                | M1 where confirmed; M2 expansion |
| Infrastructure        | Partial            | Engineer/CPDO/DPWH contracts, funding, dates, and accomplishment evidence                         | M3                               |
| Environment           | Partial            | CENRO/barangay collection calendar, scope, facilities, and complaint destinations                 | M2                               |
| Public safety         | Partial            | ACDRRMO/ACPO/BFP contacts; facility inventory and evacuation activation information               | M1 verified help; M4 layers      |
| Weather               | Partial            | PAGASA supported source, station context, timestamp/validity and refresh arrangement              | M1 links; M5 feed                |
| Geographic data       | Missing            | CPDO/NAMRIA/Geoportal geographic files, usable geometry, attribution, and hazard-source review    | M4                               |
| Jeepney routes        | Needs verification | ACTDO/LTFRB IDs, fares, terminals, direction-specific paths, and field validation                 | M4 after verification            |
| Tourism and festivals | Partial            | ACTO/CKS/DOT current schedules, access details, jurisdiction, and reuse checks                    | M2 summaries; M5 calendar        |
| Transparency          | Partial            | Budget/Accounting/Treasurer/BAC/COA source documents and year-by-year coverage                    | M3                               |
| Projects              | Partial            | CPDO/Engineer records distinguishing budget, award, spend, and dated progress                     | M3 records; M4 geometry          |
| News and culture      | Partial            | City/agency publishing access; CKS-reviewed cultural entries and reuse terms                      | M5                               |

## Content model and implementation boundaries

Use a small editorial record that preserves:

- A stable ID, canonical name, raw name/aliases, subject, and geographic scope.
- Field values with units, currency, and reference dates; unknown values stay
  null. PSGC, school IDs, and telephone numbers remain strings.
- Source URL/title/publisher, retrieval date, source version, and relevant
  page/table/worksheet/row reference. Preserve attributable conflicting values.
- Evidence status, coverage limits, reviewer, last-reviewed date, next review,
  publication disposition, and unresolved notes.

Extend existing types and optional companion JSON where practical. Maintain
Markdown for readable guidance, and use curated structured records for search,
directory entries, maps, and filters. Publication metadata and validation must
cover those records as well as prose pages.

Keep `content/reference` as retained evidence with its original bytes and hashes.
Publish reviewed derivatives through the existing `content/services`,
`content/government`, and curated `src/data` paths; never import reference
snapshots into the application. Add an explicit route/content convention for new
top-level sections rather than assuming the current document loader supports
them. Register new category indexes in `yamlLoader.ts`.

Do not add a CMS, resident accounts, a payment system, or a general-purpose
backend as a prerequisite. Reconsider tooling only when a named editor or
supported integration has a demonstrated need.

## First implementation backlog

| ID        | Deliverable                                              | Suggested owner           | Depends on   | Done when                                                                                         |
| --------- | -------------------------------------------------------- | ------------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| ~~BA-01~~ | ~~Page/source inventory and conflict register~~          | Editor                    | None         | Existing pages, gaps, and document records have dispositions and evidence links.                  |
| ~~BA-02~~ | ~~Publication metadata and validation~~                  | Developer + editor        | BA-01        | Reviewed records can express dates, provenance, unknown fields, and publication state.            |
| ~~BA-03~~ | ~~Fix missing destinations and site identity~~           | Developer + project owner | BA-01        | All exposed links resolve usefully; ownership and official-system links are accurate.             |
| BA-04     | Review first service journeys                            | Editor + relevant offices | BA-01        | Guides expose supported fields and clearly identify unresolved or historical details.             |
| ~~BA-05~~ | ~~Service search and initial filters~~                   | Developer                 | BA-02, BA-04 | Published guides are searchable; unknown fields and unavailable drafts cannot mislead results.    |
| ~~BA-06~~ | ~~Home page and Contact & Help~~                         | Developer + editor        | BA-03–BA-05  | Selected tasks are reachable on mobile and correction/help destinations work.                     |
| BA-07     | Acquire directory, financial, GIS, and transport records | Editor + project owner    | BA-01        | Requests are tracked by exact dataset, counterpart, response, and remaining gaps.                 |
| BA-08     | Beta verification and release                            | Developer + editor        | BA-03–BA-06  | Checks and browser task review pass; content owner, hosting, rollback, and maintenance are ready. |

During the first week, prioritize BA-01 and start BA-07; then define BA-02 and
review the first guides. Request confirmation only for decisions that require
the operator or external source owner. Data delays narrow the beta scope rather
than being filled with invented content.

## Release and maintenance

For behavior changes, add focused regression tests using the existing Vite/Vitest
setup. Extend content QA for new curated records and navigation without weakening
archive integrity. New search, filters, dates, and feed adapters need meaningful
failure-case tests. No new application tests are needed for this planning file.

Before each code release, run `npm run check:ci`, then perform browser checks for
mobile tasks, keyboard access, readable errors, deep links, and external-system
handoffs. Existing loader tests do not establish browser accessibility. Test
event/alert boundaries using `Asia/Manila`, including all-day events, source
timezone differences, expiration, and source failure.

Proposed operating cadence, to confirm with the publishing owner:

| Content                                             | Review trigger                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Alerts and live feeds                               | At each configured refresh; expire at a documented validity boundary and surface stale failures. |
| Transaction requirements, fees, contacts, and hours | Before beta; monthly thereafter and whenever an office publishes a change.                       |
| Officials and school authority                      | Before publication and following a term, appointment, or school-year change.                     |
| Financial documents and projects                    | On new issuances; review missing periods and progress evidence quarterly.                        |
| Census and stable heritage content                  | When the source publishes a new edition or a reviewer identifies a correction.                   |

Track coverage of reviewed priority guides, broken destinations, unresolved
high-impact conflicts, overdue reviews, and success on the selected resident
tasks. After the first resident review, use observed problems to set numerical
targets and reorder the next milestone. A category becomes complete only when
its stated scope and required fields are actually covered.

[planning-doc]: https://docs.google.com/document/d/12tTdNNL5tomBFAQpSoRla_LjOb9UhHoAcyCg9y-Vf00/edit
[psa]: https://psa.gov.ph/classification/psgc/barangays/0330100000
[council]: https://angelescity.gov.ph/city-council/
