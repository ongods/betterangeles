# Angeles City events and weather map

Verified October 15, 2026 using public, unauthenticated requests. Response evidence is saved in `content/reference/angeles-city/integrations/probe-2026-10-15.json`. These are integration references; the app's homepage has not been changed.

## Events API

The city's calendar uses The Events Calendar for WordPress. Its public JSON endpoints are live:

| Purpose                      | URL                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| Events                       | <https://angelescity.gov.ph/wp-json/tribe/events/v1/events>                                          |
| Example upcoming query       | <https://angelescity.gov.ph/wp-json/tribe/events/v1/events?start_date=2026-10-15&per_page=20&page=1> |
| API specification            | <https://angelescity.gov.ph/wp-json/tribe/events/v1/doc>                                             |
| Individual event example     | <https://angelescity.gov.ph/wp-json/tribe/events/v1/events/1218>                                     |
| Calendar subscription/export | <https://angelescity.gov.ph/events/?ical=1>                                                          |

The events list, API namespace, specification, and calendar feed returned HTTP 200. The upcoming query returned two records: Tigtigan Terakan Keng Dalan Festival and Apung Mamacalulu. The individual-event URL above comes from the returned event's `rest_url`; it was not separately requested.

The events endpoint returns `events`, `total`, and `total_pages`. Each event includes its ID, title, source URL, description, start/end date, all-day flag, timezone, and available venue information. Request subsequent `page` values when `total_pages` exceeds one.

No authentication or API key was sent. With request header `Origin: http://localhost:5173`, the JSON endpoints responded with `Access-Control-Allow-Origin: http://localhost:5173`. This verifies the required CORS response for local development; test the deployed site's origin when deploying. The calendar feed has no CORS response header, so use it as a subscription/download link or fetch it server-side.

Example for React/TypeScript:

```ts
const endpoint = new URL(
  'https://angelescity.gov.ph/wp-json/tribe/events/v1/events'
);

// Pass the date shown by the application, in the Philippines timezone.
endpoint.searchParams.set('start_date', '2026-10-15');
endpoint.searchParams.set('per_page', '20');
endpoint.searchParams.set('page', '1');

const response = await fetch(endpoint, {
  credentials: 'omit',
  signal: AbortSignal.timeout(10_000),
});
if (!response.ok) throw new Error('Unable to load city events');
const { events, total_pages } = await response.json();
```

For integration, use the current date or selected calendar date rather than leaving the example date fixed. Fetch once per page visit and cache briefly; use the saved event records as a clearly dated fallback if the live service fails. Descriptions contain HTML, so convert them to text or sanitize them before rendering.

The source has inconsistent timezone metadata: TTKD uses `UTC+8`, while Apung Mamacalulu reports `UTC+0` despite displaying 5:30 p.m. on the city page. Preserve the published wall-clock time and flag the source inconsistency; do not automatically shift that displayed event to 1:30 a.m. the following day. Treat date-only/all-day events separately from timed events.

Documentation: [The Events Calendar REST API](https://docs.nexcess.com/software/the-events-calendar/event-tickets-rest-api/).

## Weather map

The map on the [city homepage](https://angelescity.gov.ph/) is a **Windy weather map**, centered on **15.1472, 120.5849**. The city embeds two views: wind and satellite. The iframe page was requested successfully (HTTP 200); the full interactive map was not tested in a browser during this endpoint check.

Windy provides a public [embed generator](https://embed.windy.com/config/map). Embedding the map does not require an API key. The separate [Windy JavaScript Map Forecast API](https://api.windy.com/map-forecast/tutorials/hello-world) requires your own key if you later need programmatic map control.

React example using the same embed route and coordinates as the city:

```tsx
<iframe
  title="Angeles City wind and weather map"
  src="https://embed.windy.com/embed2.html?lat=15.1472&lon=120.5849&detailLat=15.1472&detailLon=120.5849&zoom=10&level=surface&overlay=wind&calendar=now&type=map&location=coordinates&marker=true&detail=true&metricWind=km%2Fh&metricTemp=%C2%B0C"
  width="100%"
  height="450"
  loading="lazy"
  allowFullScreen
  style={{ border: 0 }}
/>
```

For the satellite view, change `overlay=wind` to `overlay=satellite` and `detail=true` to `detail=false`, matching the city's second embed. Keep Windy's attribution and controls visible.
