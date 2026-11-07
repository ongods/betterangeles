import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  feedTimeoutMs,
  loadCityEvents,
  loadCityNews,
  plainText,
} from './cityFeed';

const now = new Date('2030-05-01T16:00:00Z');
const event = (overrides: Record<string, unknown> = {}) => ({
  id: 7,
  title: 'Community &amp; Culture',
  url: 'https://angelescity.gov.ph/event/community/',
  status: 'publish',
  start_date: '2030-05-03 09:30:00',
  end_date: '2030-05-03 12:00:00',
  all_day: false,
  timezone: 'Asia/Manila',
  venue: { venue: 'City Library' },
  ...overrides,
});
const news = (overrides: Record<string, unknown> = {}) => ({
  id: 8,
  title: { rendered: '𝐂𝐢𝐭𝐲 &amp; community' },
  date: '2030-05-01T23:00:00',
  link: 'https://angelescity.gov.ph/community-update/',
  ...overrides,
});

function respond(body: unknown, status = 200) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('official calendar loading', () => {
  it('requests current Philippine dates without cookies or browser-cache reuse', async () => {
    const fetch = respond({ events: [event()] });
    const result = await loadCityEvents(undefined, now);
    const [url, options] = fetch.mock.calls[0];
    expect(String(url)).toContain('start_date=2030-05-02+00%3A00%3A00');
    expect(options).toMatchObject({ credentials: 'omit', cache: 'no-store' });
    expect(result.items[0]).toMatchObject({
      title: 'Community & Culture',
      start: '2030-05-03',
      startTime: '09:30',
      timezone: 'Asia/Manila',
      venue: 'City Library',
    });
  });

  it('deduplicates and orders current events while omitting ended events', async () => {
    respond({
      events: [
        event({
          id: 9,
          start_date: '2030-05-04 10:00:00',
          end_date: '2030-05-04 11:00:00',
        }),
        event(),
        event(),
        event({
          id: 10,
          start_date: '2030-04-30 10:00:00',
          end_date: '2030-05-01 11:00:00',
        }),
      ],
    });
    expect(
      (await loadCityEvents(undefined, now)).items.map(item => item.id)
    ).toEqual([7, 9]);
  });

  it('accepts an actually empty calendar without a saved-event fallback', async () => {
    respond({ events: [], total: 0 });
    expect(await loadCityEvents(undefined, now)).toEqual({
      items: [],
      omittedCount: 0,
    });
  });

  it('rejects malformed dates, unsafe links, drafts, and invalid feed structures', async () => {
    const fetch = respond({
      events: [
        event(),
        event({ id: 11, url: 'javascript:alert(1)' }),
        event({ id: 12, start_date: '2030-02-30 10:00:00' }),
        event({ id: 13, status: 'draft' }),
      ],
    });
    expect(await loadCityEvents(undefined, now)).toMatchObject({
      items: [{ id: 7 }],
      omittedCount: 3,
    });
    fetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          events: [event({ url: 'https://example.org/event/' })],
        })
      )
    );
    await expect(loadCityEvents(undefined, now)).rejects.toThrow(
      'no readable entries'
    );
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'unavailable' }))
    );
    await expect(loadCityEvents(undefined, now)).rejects.toThrow(
      'not readable'
    );
  });

  it('keeps missing venue/timezone explicit and preserves all-day date spans', async () => {
    respond({
      events: [
        event({
          all_day: true,
          end_date: '2030-05-05 23:59:59',
          venue: false,
          timezone: undefined,
        }),
      ],
    });
    expect((await loadCityEvents(undefined, now)).items[0]).toMatchObject({
      allDay: true,
      start: '2030-05-03',
      end: '2030-05-05',
      venue: null,
      timezone: null,
    });
  });
});

describe('official city news loading', () => {
  it('uses the latest published titles and dates, with safe text and official links', async () => {
    const fetch = respond([news(), news()]);
    expect(await loadCityNews()).toEqual({
      items: [
        {
          id: 8,
          title: 'City & community',
          url: 'https://angelescity.gov.ph/community-update/',
          publishedOn: '2030-05-01',
        },
      ],
      omittedCount: 0,
    });
    expect(String(fetch.mock.calls[0][0])).toContain(
      '_fields=id%2Cdate%2Clink%2Ctitle'
    );
  });

  it('reports source failures and unreadable JSON instead of inventing content', async () => {
    const fetch = respond({}, 503);
    await expect(loadCityNews()).rejects.toThrow('HTTP 503');
    fetch.mockResolvedValueOnce(new Response('<html>Down</html>'));
    await expect(loadCityNews()).rejects.toThrow();
    fetch.mockResolvedValueOnce(new Response(JSON.stringify({ posts: [] })));
    await expect(loadCityNews()).rejects.toThrow('not readable');
  });

  it('aborts a slow source and forwards cancellation from an unmounted page', async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          const signal = options?.signal;
          if (signal?.aborted)
            reject(new DOMException('Aborted', 'AbortError'));
          else
            signal?.addEventListener(
              'abort',
              () => reject(new DOMException('Aborted', 'AbortError')),
              { once: true }
            );
        })
    );
    const timeout = expect(loadCityNews()).rejects.toMatchObject({
      name: 'AbortError',
    });
    await vi.advanceTimersByTimeAsync(feedTimeoutMs);
    await timeout;
    const controller = new AbortController();
    const cancelled = expect(
      loadCityNews(controller.signal)
    ).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await cancelled;
  });
});

it('renders external markup as plain text rather than executable HTML', () => {
  expect(
    plainText('<script>alert(1)</script><b>Culture</b> &amp; &#x1F3DB; &#8212;')
  ).toBe('Culture & 🏛 —');
});
