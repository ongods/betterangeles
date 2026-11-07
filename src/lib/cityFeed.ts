import { getPhilippineDate } from '../data/culture';

export const officialCityUrl = 'https://angelescity.gov.ph';
export const eventsPageUrl = `${officialCityUrl}/events/`;
export const newsPageUrl = `${officialCityUrl}/news/`;
export const feedRefreshMs = 5 * 60 * 1000;
export const feedTimeoutMs = 15 * 1000;

export interface CityEvent {
  id: number;
  title: string;
  url: string;
  start: string;
  end: string;
  allDay: boolean;
  startTime: string | null;
  timezone: string | null;
  venue: string | null;
}

export interface CityNews {
  id: number;
  title: string;
  url: string;
  publishedOn: string;
}

export interface FeedResult<T> {
  items: T[];
  omittedCount: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const entities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  hellip: '…',
  ntilde: 'ñ',
  Ntilde: 'Ñ',
  eacute: 'é',
  Eacute: 'É',
};

export function plainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity: string, key: string) => {
      if (!key.startsWith('#')) return entities[key] ?? entity;
      const code =
        key[1]?.toLowerCase() === 'x'
          ? Number.parseInt(key.slice(2), 16)
          : Number.parseInt(key.slice(1), 10);
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code)
        : '';
    })
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();
}

function officialLink(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value, officialCityUrl);
    const allowed = ['angelescity.gov.ph', 'www.angelescity.gov.ph'];
    if (
      url.protocol !== 'https:' ||
      !allowed.includes(url.hostname) ||
      url.port ||
      url.username ||
      url.password
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

function calendarDate(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:$|[ T])/.test(value))
    return null;
  const date = value.slice(0, 10);
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
    ? date
    : null;
}

function eventFromSource(value: unknown): CityEvent | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'number' ||
    !Number.isSafeInteger(value.id) ||
    value.id <= 0
  )
    return null;
  if (value.status !== undefined && value.status !== 'publish') return null;
  const title = plainText(value.title).slice(0, 500);
  const url = officialLink(value.url);
  const start = calendarDate(value.start_date);
  const end = calendarDate(value.end_date);
  if (!title || !url || !start || !end || end < start) return null;
  const time =
    typeof value.start_date === 'string' ? value.start_date.slice(11, 16) : '';
  const startTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : null;
  const venue = isRecord(value.venue) ? plainText(value.venue.venue) : '';
  return {
    id: value.id,
    title,
    url,
    start,
    end,
    allDay: value.all_day === true,
    startTime,
    timezone: plainText(value.timezone) || null,
    venue: venue.slice(0, 500) || null,
  };
}

function newsFromSource(value: unknown): CityNews | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'number' ||
    !Number.isSafeInteger(value.id) ||
    value.id <= 0
  )
    return null;
  const title = isRecord(value.title)
    ? plainText(value.title.rendered).slice(0, 500)
    : '';
  const url = officialLink(value.link);
  const publishedOn = calendarDate(value.date);
  return title && url && publishedOn
    ? { id: value.id, title, url, publishedOn }
    : null;
}

function parseItems<T extends { id: number }>(
  values: unknown[],
  parse: (value: unknown) => T | null
): FeedResult<T> {
  const items = new Map<number, T>();
  let omittedCount = 0;
  for (const value of values) {
    const item = parse(value);
    if (item) items.set(item.id, item);
    else omittedCount++;
  }
  if (values.length > 0 && items.size === 0)
    throw new Error('The city feed contains no readable entries.');
  return { items: [...items.values()], omittedCount };
}

async function fetchJson(url: URL, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, feedTimeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok)
      throw new Error(`The city feed returned HTTP ${response.status}.`);
    return (await response.json()) as unknown;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export async function loadCityEvents(
  signal?: AbortSignal,
  now = new Date()
): Promise<FeedResult<CityEvent>> {
  const today = getPhilippineDate(now);
  const url = new URL('/wp-json/tribe/events/v1/events', officialCityUrl);
  url.searchParams.set('per_page', '12');
  url.searchParams.set('start_date', `${today} 00:00:00`);
  const data = await fetchJson(url, signal);
  if (!isRecord(data) || !Array.isArray(data.events))
    throw new Error('The city calendar response is not readable.');
  const result = parseItems(data.events, eventFromSource);
  return {
    ...result,
    items: result.items
      .filter(event => event.end >= today)
      .sort(
        (a, b) =>
          a.start.localeCompare(b.start) ||
          (a.startTime ?? '').localeCompare(b.startTime ?? '')
      ),
  };
}

export async function loadCityNews(
  signal?: AbortSignal
): Promise<FeedResult<CityNews>> {
  const url = new URL('/wp-json/wp/v2/posts', officialCityUrl);
  url.searchParams.set('per_page', '3');
  url.searchParams.set('_fields', 'id,date,link,title');
  const data = await fetchJson(url, signal);
  if (!Array.isArray(data))
    throw new Error('The city news response is not readable.');
  return parseItems(data, newsFromSource);
}
