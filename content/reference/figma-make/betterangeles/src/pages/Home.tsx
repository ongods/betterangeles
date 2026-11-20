import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookUser, CloudSun, Landmark, Map as MapIcon, ScrollText, Search } from 'lucide-react'
import { Badge, Button, CardLink, Container, ExtLink, Icon, Section, SourceLabel, StatusBadge, TextLink, cx } from '../ui'
import { EventList, FeedStatus, NewsList } from '../components/Feeds'
import { LINKS, POPULATION, barangays, catName, categories, heritage, serviceHref, services } from '../data'
import { useFeed, type EventItem, type NewsItem } from '../feeds'

const popular = ['Business permit', 'Health ID', 'Cedula', 'Senior citizen ID', 'Barangay clearance']
const featured = ['business-permit-application', 'business-permit-renewal', 'health-id', 'birth-certificate-request'].map((s) => services.find((x) => x.slug === s)!)
const topTopics = ['civil-documents', 'business-and-livelihood', 'health', 'taxes-and-fees', 'social-welfare', 'education', 'infrastructure', 'housing-and-land-use'].map((s) => categories.find((c) => c.slug === s)!)

export default function Home() {
  const [q, setQ] = useState('')
  const go = useNavigate()
  const news = useFeed<NewsItem>('news'), events = useFeed<EventItem>('events')
  useEffect(() => { document.title = 'BetterAngeles · Community guide to Angeles City services' }, [])
  const term = q.trim().toLowerCase()
  const matches = term ? services.filter((s) => (s.title + ' ' + s.summary + ' ' + s.office).toLowerCase().includes(term)) : []
  return (
    <>
      <section className="on-dark relative overflow-hidden bg-primary-800 text-white" aria-labelledby="hero-h">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" aria-hidden="true" />
        <Container className="relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-14">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-200">Community guide · Angeles City, Pampanga</p>
            <h1 id="hero-h" className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Find a city service and know what to bring</h1>
            <p className="mt-4 max-w-xl text-lg text-primary-100">Search plain-language guides, see which office handles each task, and continue to the official portal when you’re ready.</p>
            <form role="search" className="mt-8 max-w-2xl" onSubmit={(e) => { e.preventDefault(); go(`/services${term ? '?q=' + encodeURIComponent(q.trim()) : ''}`) }}>
              <label htmlFor="home-q" className="mb-2 block text-sm font-semibold text-primary-50">Search service guides</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input id="home-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" aria-describedby="home-q-live" placeholder="e.g. business permit, health ID"
                    className="h-14 w-full rounded-ctl border-0 bg-white pl-12 pr-4 text-base text-ink shadow-lg placeholder:text-subtle" />
                </div>
                <Button type="submit" className="min-h-14 px-6 text-base">Search guides</Button>
              </div>
              <p id="home-q-live" className="sr-only" aria-live="polite">{term ? `${matches.length} matching ${matches.length === 1 ? 'guide' : 'guides'}` : ''}</p>
              {term && (
                <div className="mt-2 animate-enter overflow-hidden rounded-ctl bg-white text-ink shadow-xl">
                  {matches.length ? <ul className="divide-y divide-line">{matches.slice(0, 4).map((s) => <li key={s.slug}><Link to={serviceHref(s)} className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50">
                    <span className="min-w-0 flex-1"><span className="block font-semibold text-primary-700">{s.title}</span><span className="block truncate text-sm text-muted">{catName(s.category)} · {s.office}</span></span><ArrowRight className="size-4 shrink-0 text-subtle" aria-hidden="true" /></Link></li>)}</ul>
                    : <p className="px-4 py-3 text-[15px] text-muted">No guide matches “{q.trim()}”. Try fewer words, or <Link to="/services" className="font-semibold text-primary-700 underline">browse by topic</Link>.</p>}
                  {matches.length > 0 && <Link to={`/services?q=${encodeURIComponent(q.trim())}`} className="flex items-center justify-between border-t border-line bg-surface px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50">See all {matches.length} {matches.length === 1 ? 'result' : 'results'} with filters<ArrowRight className="size-4" aria-hidden="true" /></Link>}
                </div>
              )}
            </form>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-primary-200">Popular:</span>
              {popular.map((p) => <Link key={p} to={`/services?q=${encodeURIComponent(p)}`} className="inline-flex min-h-9 items-center rounded-full bg-white/10 px-3.5 font-medium text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20">{p}</Link>)}
            </div>
          </div>
          <div className="rounded-card bg-white/[0.06] p-5 ring-1 ring-inset ring-white/15">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-200">Most-used guides</h2>
            <ul className="mt-2 divide-y divide-white/10">{featured.map((s) => <li key={s.slug}><Link to={serviceHref(s)} className="group flex items-center gap-3 py-3">
              <span className="min-w-0 flex-1"><span className="block font-semibold group-hover:underline">{s.title}</span><span className="mt-0.5 block text-sm text-primary-200">{s.portal ? 'Official online portal available' : 'Walk-in guide'}</span></span><ArrowRight className="size-4 shrink-0 text-primary-200 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></Link></li>)}</ul>
            <Link to="/services" className="mt-2 inline-flex min-h-11 items-center gap-1 font-semibold text-white underline underline-offset-4">Browse all guides<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </Container>
      </section>

      <Container>
        <Section title="Browse by topic" id="topics" action={<TextLink to="/services">All 12 topics</TextLink>}>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {topTopics.map((c) => { const n = services.filter((s) => s.category === c.slug).length; return (
              <li key={c.slug}><CardLink to={`/services/${c.slug}`} className="flex-col gap-3">
                <span className="grid size-10 place-items-center rounded-ctl bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-100 transition-colors group-hover:bg-primary-500 group-hover:text-white"><Icon name={c.icon} /></span>
                <span><span className="block font-semibold leading-snug text-primary-900 group-hover:text-primary-700">{c.name}</span><span className="mt-0.5 block text-sm text-muted">{n} {n === 1 ? 'guide' : 'guides'}</span></span>
              </CardLink></li>) })}
          </ul>
        </Section>

        <Section title="Transact on official systems" id="portals" divider tagline="BetterAngeles doesn’t take applications, payments or appointments. These are the official destinations.">
          <ul className="grid gap-3 md:grid-cols-3">
            {[[LINKS.ebpls, 'Business permits (eBPLS)', 'New applications, renewals and payment redirects.'], [LINKS.health, 'City Health ID portal', 'Register for the city Health ID.'], [LINKS.city, 'Official city website', 'Announcements, citizen’s charters and offices.']].map(([h, t, d]) => (
              <li key={h}><CardLink href={h} className="flex-col">
                <span className="flex items-start justify-between gap-2"><span className="font-semibold text-primary-900 group-hover:text-primary-700">{t}</span><Badge tone="primary">Official site</Badge></span>
                <span className="mt-1 text-sm text-muted">{d}</span>
                <span className="mt-3 text-sm font-medium text-primary-700">{new URL(h).hostname.replace('www.', '')} ↗</span>
              </CardLink></li>))}
          </ul>
        </Section>

        <div className="grid gap-x-12 border-t border-line lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Section title="City news" id="news" action={<TextLink to="/culture">All news</TextLink>}>
            <FeedStatus f={news} name="news" />
            <NewsList f={news} limit={3} />
            <p className="mt-3 text-sm text-muted">News is not an emergency alert. For weather advisories, see <ExtLink href={LINKS.pagasa}>PAGASA</ExtLink>.</p>
          </Section>
          <Section title="Upcoming events" id="events" action={<TextLink to="/culture">Calendar</TextLink>}>
            <FeedStatus f={events} name="events" />
            <EventList f={events} filter="upcoming" limit={3} />
          </Section>
        </div>

        <Section title="Explore Angeles" id="explore" divider tagline="City facts, heritage and the map, with sources shown beside each figure.">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">City at a glance</h3>
              <dl className="mt-3 grid grid-cols-2 gap-4">
                <div><dt className="text-sm text-muted">{POPULATION.label} (2020)</dt><dd className="text-3xl font-bold tabular-nums text-primary-900">{POPULATION.value}</dd></div>
                <div><dt className="text-sm text-muted">Barangays</dt><dd className="text-3xl font-bold tabular-nums text-primary-900">{barangays.length}</dd></div>
              </dl>
              <div className="mt-3"><SourceLabel label="PSA" href={LINKS.psa} date="Census year 2020" /></div>
              <p className="mt-4 flex items-start gap-2 text-sm text-muted"><CloudSun className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>No live weather is shown. See <ExtLink href={LINKS.pagasa}>PAGASA forecasts</ExtLink>.</span></p>
              <p className="mt-3"><TextLink to="/about">City profile</TextLink></p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Heritage to explore</h3>
              <ul className="mt-3 space-y-3">{heritage.map((h) => <li key={h.name}><p className="font-semibold">{h.name}</p><p className="text-sm text-muted">{h.note}</p></li>)}</ul>
              <p className="mt-3"><TextLink to="/about#identity">Heritage and culture</TextLink></p>
            </div>
            <Link to="/map" className="group flex flex-col overflow-hidden rounded-card border border-line transition-colors hover:border-primary-500">
              <span className="relative grid h-32 place-items-center bg-surface [background-image:linear-gradient(#d9e1ec_1px,transparent_1px),linear-gradient(90deg,#d9e1ec_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true">
                <span className="grid size-12 place-items-center rounded-full bg-white text-primary-600 shadow-sm ring-1 ring-line"><MapIcon className="size-6" /></span></span>
              <span className="p-4"><span className="block font-semibold text-primary-700 group-hover:underline">Interactive map</span><span className="mt-1 block text-sm text-muted">OpenStreetMap basemap with a searchable list of offices, barangays and portals. No facility markers are validated yet.</span></span>
            </Link>
          </div>
        </Section>

        <Section title="Government and public records" id="gov" divider>
          <ul className="grid gap-3 md:grid-cols-3">
            {([['/government', Landmark, 'Government', 'Executive, council, departments and barangays.'], ['/directory', BookUser, 'City Directory', 'Search offices, barangays and official portals.'], ['/transparency', ScrollText, 'Transparency', 'Budget, revenue and procurement records with sources.']] as const).map(([to, I, t, d]) => (
              <li key={to}><CardLink to={to} className="items-start gap-3"><I className={cx('mt-0.5 size-5 shrink-0 text-primary-600')} aria-hidden="true" /><span><span className="block font-semibold text-primary-900 group-hover:text-primary-700">{t}</span><span className="mt-0.5 block text-sm text-muted">{d}</span></span></CardLink></li>))}
          </ul>
          <p className="mt-4 text-sm text-muted">Transparency entries in this prototype are <StatusBadge status="illustrative" /> and never show totals.</p>
        </Section>
      </Container>
    </>
  )
}
