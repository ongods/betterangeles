import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  feedRefreshMs,
  loadCityEvents,
  loadCityNews,
  type CityEvent,
  type CityNews,
  type FeedResult,
} from '../lib/cityFeed';

export interface FeedState<T> {
  items: T[] | null;
  updatedAt: Date | null;
  loading: boolean;
  error: boolean;
  omittedCount: number;
}

function initialState<T>(): FeedState<T> {
  return {
    items: null,
    updatedAt: null,
    loading: true,
    error: false,
    omittedCount: 0,
  };
}

export function useCityFeeds() {
  const [events, setEvents] = useState<FeedState<CityEvent>>(initialState);
  const [news, setNews] = useState<FeedState<CityNews>>(initialState);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    let busy = false;
    let controller: AbortController | null = null;
    async function settle<T>(
      load: (signal?: AbortSignal) => Promise<FeedResult<T>>,
      update: Dispatch<SetStateAction<FeedState<T>>>,
      signal: AbortSignal
    ) {
      if (active) update(previous => ({ ...previous, loading: true }));
      try {
        const result = await load(signal);
        if (active)
          update({
            ...result,
            updatedAt: new Date(),
            loading: false,
            error: false,
          });
      } catch {
        if (active)
          update(previous => ({ ...previous, loading: false, error: true }));
      }
    }
    async function refresh() {
      if (!active || busy) return;
      busy = true;
      controller = new AbortController();
      try {
        await Promise.all([
          settle(loadCityEvents, setEvents, controller.signal),
          settle(loadCityNews, setNews, controller.signal),
        ]);
      } catch {
        if (active) {
          setEvents(previous => ({ ...previous, loading: false, error: true }));
          setNews(previous => ({ ...previous, loading: false, error: true }));
        }
      } finally {
        busy = false;
      }
    }
    const requestRefresh = () => {
      void refresh();
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') requestRefresh();
    };
    requestRefresh();
    const timer = window.setInterval(refreshWhenVisible, feedRefreshMs);
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [revision]);

  return { events, news, refresh: () => setRevision(value => value + 1) };
}
