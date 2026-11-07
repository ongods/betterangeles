# Roadmap implementation status

Updated 7 November 2026. This records implemented behavior and remaining work;
it does not certify current government information or claim a production release.

The implementation follows the user's decision to proceed with available data
and update it when better evidence arrives. The original Google Doc is unchanged.

| Milestone                      | Implemented using available evidence                                                                                                                                                                                                             | Remaining work                                                                                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0: Evidence reconciliation    | ~~Captured the four-tab Google Doc with revision and source links; inventoried all 59 service topics; mapped guide URLs to document source IDs; preserved 42 dated guides and 17 explicit gaps~~                                                 | Independent office confirmation, project operator/editor assignment, and original workbook provenance remain open.                                                                                      |
| M1: Public beta implementation | ~~Search, category and supported-online-link filters; working home and help pages; missing-topic recovery; corrected branding, SEO, navigation, and legislative document routing~~                                                               | Resident task review, independent accessibility review, verified current transaction details, and deployment are still required before declaring a public release.                                      |
| M2: City and directories       | ~~About/profile, all 33 PSGC barangay records, 53 public-school records from combined sources, eight dated private-school records, six TB-program health units, five office entries, six heritage places~~                                       | Resolve school-ID discrepancies and current directory coverage; verify contacts, appointments, clinic schedules, and coordinates. Only reviewed English UI is exposed; translation work is not claimed. |
| M3: Transparency               | ~~Searchable initial library of two saved documents, one revenue report, one procurement notice, and two project records, with amount types and unknown progress~~                                                                               | Approved budgets, financial statements, audit contents, awards, contracts, and current project progress are unavailable. No financial dashboard or completion percentages are inferred.                 |
| M4: Location discovery         | ~~Searchable text directory works without a map or geolocation~~                                                                                                                                                                                 | No verified point coordinates, boundary files, hazard geometry, or jeepney paths have been obtained. A map is not presented with invented locations.                                                    |
| M5: Feeds and culture          | ~~Official calendar and latest-news feeds, refresh on visit and every five minutes while visible, refresh on return, manual refresh, source timestamps, independent failure states, and no static fallback; quiz removed at the user's request~~ | Weather and active-warning feeds, publishing ownership, reusable dictionary entries, and reviewed Kulitan material remain unavailable. Public API availability depends on the city website.             |

Completed work is crossed out. Milestones remain open where work is listed in
the remaining-work column.

## Reconciliation decisions

| Evidence difference                                                                                            | Implementation decision                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The newer Google Doc has fewer school records and cannot extract the council roster                            | Retain the repository's source evidence. Join school records by school ID and preserve source-specific names; keep the existing dated legislative page.                                                                       |
| A legislative slug also has a registered nested index                                                          | Prefer the actual Markdown document when it exists, so the council table is reachable.                                                                                                                                        |
| Enrica Sandico ES is listed as 107028 in the Doc; the archive lists Enrica Sandico Integrated School as 502867 | Keep source-specific records and mark the unresolved relationship. Neither an ID replacement nor two current institutions is inferred.                                                                                        |
| Business form and charter differ in conditional requirements                                                   | Keep the differences visible in the existing guide and document record. No single definitive checklist is invented.                                                                                                           |
| Health ID portal requirements differ from August health-card charters                                          | Add a dated portal section with links and baseline requirements; explicitly label the older fee tables and procedures as archived.                                                                                            |
| Local officials workbook has an unconfirmed issuer/date and questionable telephone values                      | Preserve it in the source snapshot. Do not promote these telephone values into verified public office contacts.                                                                                                               |
| Static October event records were shown instead of current listings                                            | Replace the static list with the official calendar API, query from the current Philippine date, and preserve the source's published dates and timezone labels. Show a genuine empty state when no upcoming events are listed. |
| Starter content describes Lapu-Lapu or an official government site                                             | Use BetterAngeles community-guide wording and remove unavailable language choices and broken starter links.                                                                                                                   |

## Where to update information

- `src/data/angeles.json`: curated profile, directory, heritage, and source records.
- `src/data/serviceMetadata.ts`: reviewed search synonyms and official online links.
- `content/services` and `content/government`: readable guidance and category indexes.
- `src/data/transparency.ts`: distinct amounts, dates, evidence labels, and unknowns.
- `src/data/culture.ts`: Philippine calendar-date helpers.
- `src/lib/cityFeed.ts`: official endpoint URLs, response validation, and cancellation.
- `src/hooks/useCityFeeds.ts`: refresh timing and independent event/news states.
- [Content inventory](CONTENT-INVENTORY.md): all available guides and source gaps.

Keep reference files immutable. To import another source version, save a new
named snapshot under `content/reference/angeles-city`, reconcile it with curated
records, and retain the old snapshot. The existing offline importer reproduces
the October 28 dataset; it is not a live synchronizer or an instruction to
overwrite later editorial changes.

`node scripts/angeles-publication-inventory.mjs` refreshes the publication
inventory from the current guides; review its output and format the generated
Markdown. `npm run check:ci` checks code, tests, content, preserved archives, the
captured source hash, and exclusion of planning evidence from production assets.

## Verification

Validation on 7 November 2026: `npm run check:ci` passed, including 37 regression
tests and both source/built-content QA. The live-feed browser pass completed
22 checks at desktop and mobile widths, including real official API/CORS requests
and simulated updates, empty calendars, failures, stale data, and retries.
There were no uncaught application exceptions. The existing large-bundle
advisory remains; the main JavaScript chunk is approximately 676 kB before gzip.

- Regression coverage includes search terms and filters, source-gap exclusion,
  accent/identifier lookup, historical directory scope, event date boundaries,
  and the legislative Markdown/index collision. Feed tests cover empty calendars,
  source errors, timeouts, cancellation, unsafe links, and live-data normalization.
- The live-feed browser checks cover polling, pause while hidden, refresh on
  return, independent source failures, stale-data labels, manual retry, empty
  responses, quiz removal, and page overflow. The earlier implementation's
  navigation, search, keyboard, and skip-link checks remain documented in its
  original QA report.
- These checks do not establish complete accessibility conformance, current
  government availability, or production hosting readiness.
