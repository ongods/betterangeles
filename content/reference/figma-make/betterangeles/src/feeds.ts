import { useCallback, useEffect, useRef, useState } from 'react'
import { LINKS } from './data'
// Prototype feed adapter: simulates the official calendar/news adapters. Entries are illustrative.
export type EventItem = { id: string; title: string; date: string; status: 'scheduled' | 'cancelled' | 'postponed'; source: string; sourceHref: string }
export type NewsItem = { id: string; title: string; published: string; source: string; sourceHref: string }
const day = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10)
const CAL = 'Official city calendar (sample)'
const EVENTS: EventItem[] = [
  { id: 'e4', title: 'Sample: outdoor event', date: day(5), status: 'cancelled', source: CAL, sourceHref: LINKS.cityNews },
  { id: 'e1', title: 'Sample: city cultural program', date: day(12), status: 'scheduled', source: CAL, sourceHref: LINKS.cityNews },
  { id: 'e2', title: 'Sample: public consultation', date: day(25), status: 'postponed', source: CAL, sourceHref: LINKS.cityNews },
  { id: 'e3', title: 'Sample: community fair', date: day(-9), status: 'scheduled', source: CAL, sourceHref: LINKS.cityNews },
]
const NEWS: NewsItem[] = [
  { id: 'n1', title: 'Sample headline: city announcement', published: day(-2), source: 'angelescity.gov.ph (sample)', sourceHref: LINKS.cityNews },
  { id: 'n2', title: 'Sample headline: service advisory', published: day(-6), source: 'angelescity.gov.ph (sample)', sourceHref: LINKS.cityNews },
]
export type FeedStatus = 'loading' | 'ok' | 'error'
export type FeedState<T> = {
  status: FeedStatus; data: T[]; fetchedAt?: Date; refreshing: boolean
  /** Last refresh failed but earlier data is still shown. */
  stale: boolean; refresh: () => void
}
export function useFeed<T>(kind: 'events' | 'news'): FeedState<T> {
  const [s, set] = useState<{ status: FeedStatus; data: T[]; fetchedAt?: Date; refreshing: boolean; stale: boolean }>({ status: 'loading', data: [], refreshing: false, stale: false })
  const attempts = useRef(0)
  const load = useCallback(() => {
    set((p) => ({ ...p, refreshing: !!p.fetchedAt, status: p.fetchedAt ? p.status : 'loading' }))
    const t = setTimeout(() => {
      // Count only completed attempts, so StrictMode's cancelled first run does not consume one.
      const n = ++attempts.current
      // Deterministic demo: news fails on the first attempt; events fail on every third attempt,
      // so both the empty failure state and the "kept previous data" stale state can be seen.
      const fail = kind === 'news' ? n === 1 : n % 3 === 0
      if (fail) set((p) => ({ ...p, refreshing: false, status: p.fetchedAt ? 'ok' : 'error', stale: !!p.fetchedAt }))
      else set({ status: 'ok', data: (kind === 'events' ? EVENTS : NEWS) as T[], fetchedAt: new Date(), refreshing: false, stale: false })
    }, kind === 'events' ? 700 : 1100)
    return () => clearTimeout(t)
  }, [kind])
  useEffect(() => { const cancel = load(); return cancel }, [load])
  // Data older than six hours is also treated as stale.
  const old = !!s.fetchedAt && Date.now() - s.fetchedAt.getTime() > 6 * 36e5
  return { ...s, stale: s.stale || old, refresh: () => { load() } }
}
export const today = () => new Date().toISOString().slice(0, 10)
export const fmt = (d: string) => new Date(d + 'T00:00').toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
export const dateParts = (d: string) => { const x = new Date(d + 'T00:00'); return { mon: x.toLocaleDateString('en-PH', { month: 'short' }), day: x.getDate(), wk: x.toLocaleDateString('en-PH', { weekday: 'short' }) } }
export const isUpcoming = (e: EventItem) => e.status === 'scheduled' && e.date >= today()
export const timeAgo = (d: Date) => { const s = Math.round((Date.now() - d.getTime()) / 1000); return s < 45 ? 'just now' : s < 3600 ? `${Math.round(s / 60)} min ago` : d.toLocaleString('en-PH', { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' }) }
