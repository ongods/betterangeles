import { useEffect, useRef, useState } from 'react'
import { CalendarX2, Newspaper, RefreshCw } from 'lucide-react'
import { Badge, Button, EmptyState, ExtLink, Notice, Skeleton, StatusBadge, cx, type BadgeTone } from '../ui'
import { LINKS } from '../data'
import { dateParts, fmt, isUpcoming, timeAgo, today, type EventItem, type FeedState, type NewsItem } from '../feeds'

/** Retrieval time, stale marker and a refresh control that reports its outcome without clearing the list. */
export function FeedStatus({ f, name }: { f: FeedState<unknown>; name: string }) {
  const [msg, setMsg] = useState('')
  const was = useRef(f.refreshing)
  const [, tick] = useState(0)
  useEffect(() => { const t = setInterval(() => tick((n) => n + 1), 30000); return () => clearInterval(t) }, [])
  useEffect(() => {
    if (f.refreshing && !was.current) setMsg(`Refreshing ${name}…`)
    if (!f.refreshing && was.current) setMsg(f.stale ? `Couldn’t refresh ${name}. Showing earlier items.` : `${name[0].toUpperCase() + name.slice(1)} updated.`)
    was.current = f.refreshing
  }, [f.refreshing, f.stale, name])
  useEffect(() => { if (!msg || f.refreshing) return; const t = setTimeout(() => setMsg(''), 4000); return () => clearTimeout(t) }, [msg, f.refreshing])
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
      <span>{f.fetchedAt ? <>Retrieved <time dateTime={f.fetchedAt.toISOString()}>{timeAgo(f.fetchedAt)}</time></> : f.status === 'loading' ? 'Retrieving…' : 'Not retrieved yet'}</span>
      {f.stale && <Badge tone="warning">Stale</Badge>}
      {f.status !== 'loading' && <Button variant="ghost" size="sm" className="-my-1" onClick={f.refresh} disabled={f.refreshing} aria-label={`Refresh ${name}`}>
        <RefreshCw className={cx('size-4', f.refreshing && 'animate-spin')} aria-hidden="true" />{f.refreshing ? 'Refreshing' : 'Refresh'}</Button>}
      <span role="status" className="text-ink">{msg}</span>
    </div>
  )
}

function FeedError({ f, name }: { f: FeedState<unknown>; name: string }) {
  return <Notice tone="danger" live title={`${name[0].toUpperCase() + name.slice(1)} could not be loaded`} action={<Button variant="secondary" size="sm" loading={f.refreshing} onClick={f.refresh}>Try again</Button>}>
    The rest of the page still works. You can also read updates at <ExtLink href={LINKS.cityNews}>angelescity.gov.ph</ExtLink>.
  </Notice>
}
function StaleNote({ f, name }: { f: FeedState<unknown>; name: string }) {
  if (!f.stale || f.refreshing) return null
  return <Notice tone="warning" compact className="mb-3" action={<Button variant="secondary" size="sm" onClick={f.refresh}>Retry</Button>}>The latest {name} refresh failed. Items below were retrieved {f.fetchedAt ? timeAgo(f.fetchedAt) : 'earlier'}.</Notice>
}

export function NewsList({ f, limit }: { f: FeedState<NewsItem>; limit?: number }) {
  if (f.status === 'loading' && !f.fetchedAt) return <Skeleton lines={4} />
  if (f.status === 'error' && !f.fetchedAt) return <FeedError f={f} name="news" />
  const items = f.data.slice(0, limit)
  return (
    <>
      <StaleNote f={f} name="news" />
      {items.length === 0 ? <EmptyState icon={Newspaper} title="No news items">The feed returned no items. Check <ExtLink href={LINKS.cityNews}>angelescity.gov.ph</ExtLink>.</EmptyState> :
        <ul className={cx('divide-y divide-line border-y border-line transition-opacity', f.refreshing && 'opacity-60')}>
          {items.map((n) => <li key={n.id} className="py-3.5">
            <p className="font-semibold leading-snug">{n.title}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted"><time dateTime={n.published}>{fmt(n.published)}</time><span aria-hidden="true">·</span><ExtLink href={n.sourceHref}>{n.source}</ExtLink><StatusBadge status="illustrative" /></p>
          </li>)}
        </ul>}
    </>
  )
}

export const eventLabel = (e: EventItem): [BadgeTone, string] =>
  e.status === 'cancelled' ? ['danger', 'Cancelled'] : e.status === 'postponed' ? ['warning', 'Postponed · new date not confirmed'] : e.date < today() ? ['neutral', 'Ended'] : ['success', 'Upcoming']
export type EventFilter = 'all' | 'upcoming' | 'changed' | 'past'
export const eventFilters: [EventFilter, string, (e: EventItem) => boolean][] = [
  ['all', 'All', () => true], ['upcoming', 'Upcoming', isUpcoming], ['changed', 'Cancelled or postponed', (e) => e.status !== 'scheduled'], ['past', 'Ended', (e) => e.status === 'scheduled' && e.date < today()],
]
export function EventList({ f, limit, filter = 'all', onReset }: { f: FeedState<EventItem>; limit?: number; filter?: EventFilter; onReset?: () => void }) {
  if (f.status === 'loading' && !f.fetchedAt) return <Skeleton lines={4} />
  if (f.status === 'error' && !f.fetchedAt) return <FeedError f={f} name="events" />
  const test = eventFilters.find(([k]) => k === filter)![2]
  const items = [...f.data].sort((a, b) => a.date.localeCompare(b.date)).filter(test).slice(0, limit)
  return (
    <>
      <StaleNote f={f} name="events" />
      {items.length === 0 ? <EmptyState icon={CalendarX2} title={filter === 'upcoming' ? 'No upcoming events' : 'No events in this view'} action={onReset && filter !== 'all' && <Button variant="secondary" size="sm" onClick={onReset}>Show all events</Button>}>
        Check the <ExtLink href={LINKS.cityNews}>official city calendar</ExtLink> for new listings.</EmptyState> :
        <ul className={cx('animate-enter divide-y divide-line border-y border-line transition-opacity', f.refreshing && 'opacity-60')} key={filter}>
          {items.map((e) => {
            const d = dateParts(e.date), [tone, label] = eventLabel(e), off = e.status !== 'scheduled' || e.date < today()
            return <li key={e.id} className="flex gap-4 py-3.5">
              <span className={cx('grid w-14 shrink-0 place-items-center rounded-ctl py-1.5 text-center ring-1 ring-inset', off ? 'bg-surface text-muted ring-line' : 'bg-primary-50 text-primary-800 ring-primary-200')} aria-hidden="true">
                <span className="text-[11px] font-semibold uppercase tracking-wide">{d.mon}</span><span className="text-xl font-bold leading-none">{d.day}</span><span className="text-[11px]">{d.wk}</span></span>
              <div className="min-w-0">
                <p className={cx('font-semibold leading-snug', e.status === 'cancelled' && 'line-through decoration-muted/60')}>{e.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted"><time dateTime={e.date}>{fmt(e.date)}</time><Badge tone={tone}>{label}</Badge></p>
                <p className="mt-1 text-sm"><ExtLink href={e.sourceHref}>{e.source}</ExtLink></p>
              </div>
            </li>
          })}
        </ul>}
    </>
  )
}
