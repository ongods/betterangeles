import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Accessibility as A11y, Briefcase, Building, CircleCheck, FileText, GraduationCap, HandCoins, HeartPulse, IdCard, RotateCcw, SlidersHorizontal, UserRound } from 'lucide-react'
import {
  Accordion, BackLink, Badge, Button, CardLink, ChipGroup, Container, CopyLinkButton, EmptyState, ExtLink, Facts, FilterTag, Icon, LinkButton, List, ListRow, Meta,
  Notice, OnThisPage, PageHeader, SearchField, Section, SelectField, Sheet, SourceLabel, StatusBadge, TextLink, Unknown, cx, lastList, useRememberList, useStored,
} from '../ui'
import { audiences, catName, categories, directory, issueUrl, offices, serviceHref, services, sourceGaps, SOURCE_GAPS, SUPPORTED_GUIDES, type Service } from '../data'
import NotFound from './NotFound'

type F = { category?: string; q: string; access: string; office: string; aud: string }
const match = (s: Service, f: F) =>
  (!f.category || s.category === f.category) &&
  (!f.q || (s.title + ' ' + s.summary + ' ' + s.office).toLowerCase().includes(f.q.toLowerCase().trim())) &&
  (!f.access || s.access.toLowerCase().includes(f.access === 'Online' ? 'online' : 'walk')) &&
  (!f.office || s.office === f.office) &&
  (!f.aud || s.audience.includes(f.aud as never))

// Shortcuts adapted from BetterSolano's "Browse by life event", limited to filters the data supports.
const needs: { icon: typeof Briefcase; label: string; hint: string; to: string }[] = [
  { icon: Briefcase, label: 'Starting or renewing a business', hint: 'Permits and the eBPLS handoff', to: '/services/business-and-livelihood' },
  { icon: FileText, label: 'Getting a civil record or clearance', hint: 'Birth, marriage and barangay clearance', to: '/services/civil-documents' },
  { icon: UserRound, label: 'Services for senior citizens', hint: 'IDs and health services', to: '/services?audience=Seniors' },
  { icon: A11y, label: 'Services for persons with disability', hint: 'PWD ID and related guides', to: '/services?audience=PWDs' },
  { icon: GraduationCap, label: 'Student support', hint: 'Scholarships and student documents', to: '/services?audience=Students' },
  { icon: HandCoins, label: 'Paying local taxes', hint: 'Cedula and real property tax', to: '/services/taxes-and-fees' },
  { icon: Building, label: 'Building or renovating', hint: 'Building permit and zoning', to: '/services/infrastructure' },
  { icon: HeartPulse, label: 'Health ID and clinics', hint: 'City Health ID portal', to: '/services/health' },
]

export function Services() {
  const { category } = useParams()
  const nav = useNavigate()
  const { state } = useLocation()
  const [sp, setSp] = useSearchParams()
  const [sheet, setSheet] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  useRememberList('services')
  useEffect(() => { if ((state as { focusSearch?: boolean } | null)?.focusSearch) searchRef.current?.focus() }, [state])
  const cat = categories.find((c) => c.slug === category)
  const f: F = { category, q: sp.get('q') ?? '', access: sp.get('access') ?? '', office: sp.get('office') ?? '', aud: sp.get('audience') ?? '' }
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }) }
  const qs = (n = sp) => (n.toString() ? '?' + n.toString() : '')
  const results = services.filter((s) => match(s, f))
  // Facet count: results if this one option replaced the current value of its group.
  const count = (patch: Partial<F>) => services.filter((s) => match(s, { ...f, ...patch })).length
  const filtering = !!(f.access || f.office || f.aud)
  const gaps = filtering ? [] : sourceGaps.filter((g) => (!category || g.category === category) && (!f.q || g.title.toLowerCase().includes(f.q.toLowerCase())))
  if (category && !cat) return <NotFound />

  const tags: [string, string, () => void][] = []
  if (cat) tags.push(['Topic', cat.name, () => nav('/services' + qs())])
  if (f.access) tags.push(['Access', f.access === 'Online' ? 'Online available' : 'Walk-in available', () => set('access', '')])
  if (f.aud) tags.push(['For', f.aud, () => set('audience', '')])
  if (f.office) tags.push(['Office', f.office, () => set('office', '')])
  if (f.q) tags.push(['Search', `“${f.q}”`, () => set('q', '')])
  const clearAll = () => nav('/services', { replace: false })
  const browsing = !cat && !f.q && !filtering

  const filterControls = (sfx: string) => (
    <div className="space-y-6">
      <nav aria-label="Topics">
        <p className="mb-2 text-sm font-semibold">Topic</p>
        <ul className="space-y-0.5">
          {[{ slug: '', name: 'All topics' }, ...categories].map((c) => {
            const on = (category ?? '') === c.slug
            const n = count({ category: c.slug || undefined })
            return <li key={c.slug || 'all'}><Link to={`/services${c.slug ? '/' + c.slug : ''}${qs()}`} onClick={() => setSheet(false)} aria-current={on ? 'page' : undefined}
              className={cx('flex min-h-10 items-center justify-between gap-2 rounded-md px-3 text-[15px] transition-colors', on ? 'bg-primary-700 font-semibold text-white' : 'text-ink hover:bg-primary-50', !on && n === 0 && 'text-subtle')}>
              <span className="min-w-0 truncate">{c.name}</span><span className={cx('text-sm tabular-nums', on ? 'text-primary-100' : 'text-muted')}>{n}</span></Link></li>
          })}
        </ul>
      </nav>
      <ChipGroup label="Access" value={f.access} onChange={(v) => set('access', v === f.access ? '' : v)} options={[{ value: '', label: 'Any' }, { value: 'Online', label: 'Online', count: count({ access: 'Online' }) }, { value: 'Walk-in', label: 'Walk-in', count: count({ access: 'Walk-in' }) }]} />
      <ChipGroup label="Who it’s for" value={f.aud} onChange={(v) => set('audience', v === f.aud ? '' : v)} options={[{ value: '', label: 'Everyone' }, ...audiences.map((a) => ({ value: a, label: a, count: count({ aud: a }) }))]} />
      <SelectField id={'f-office' + sfx} label="Responsible office" value={f.office} all="All offices" options={offices.map((o) => [o, `${o} (${count({ office: o })})`])} onChange={(v) => set('office', v)} />
    </div>
  )

  return (
    <>
      <PageHeader eyebrow={cat ? 'Service topic' : 'Service guides'} title={cat ? cat.name : 'Find a service'} crumbs={cat ? [{ label: 'Services', to: '/services' }, { label: cat.name }] : [{ label: 'Services' }]}
        summary={cat ? cat.blurb : 'Search by task, document or office. Each guide lists what to prepare and links to the official place to transact.'}>
        <form role="search" className="max-w-2xl" onSubmit={(e) => { e.preventDefault(); document.getElementById('results')?.focus() }}>
          <SearchField id="svc-q" label="Search service guides" hideLabel size="lg" inputRef={searchRef} value={f.q} onChange={(v) => set('q', v)} placeholder="Search e.g. business permit, cedula, senior ID" />
        </form>
      </PageHeader>

      {browsing && (
        <Container>
          <Section title="Browse by topic" id="topics" tagline="Twelve topics. Topics without a supported guide list their recorded source gaps.">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => {
                const n = services.filter((s) => s.category === c.slug).length, g = sourceGaps.filter((x) => x.category === c.slug).length
                return <li key={c.slug}><CardLink to={`/services/${c.slug}`} className="gap-3.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-ctl bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-100 transition-colors group-hover:bg-primary-500 group-hover:text-white"><Icon name={c.icon} /></span>
                  <span className="min-w-0"><span className="block font-semibold text-primary-900 group-hover:text-primary-700">{c.name}</span><span className="mt-0.5 block text-sm text-muted">{c.blurb}</span>
                    <span className="mt-2 block text-sm font-medium text-ink">{n ? `${n} ${n === 1 ? 'guide' : 'guides'}` : 'No guide yet'}{g > 0 && <span className="font-normal text-muted"> · {g} source {g === 1 ? 'gap' : 'gaps'}</span>}</span></span>
                </CardLink></li>
              })}
            </ul>
          </Section>
          <Section title="Browse by need" id="needs" divider tagline="Shortcuts into the guide list with the matching topic or audience applied.">
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {needs.map((n) => <li key={n.label} className="border-b border-line"><Link to={n.to} className="group flex min-h-16 items-center gap-3 py-3">
                <n.icon className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
                <span className="min-w-0 flex-1"><span className="block font-semibold text-primary-700 group-hover:underline">{n.label}</span><span className="block text-sm text-muted">{n.hint}</span></span></Link></li>)}
            </ul>
          </Section>
        </Container>
      )}

      <Container className={browsing ? 'border-t border-line' : ''}>
        <div className="grid gap-8 py-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          <aside aria-label="Filters" className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-lg font-bold">Filter guides</h2>
              {filterControls('')}
              <p className="border-t border-line pt-4 text-sm text-muted">The repository supports {SUPPORTED_GUIDES} guides and records {SOURCE_GAPS} source gaps. This prototype shows {services.length} guides.</p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="results" tabIndex={-1} className="text-xl font-bold text-primary-900 outline-none">{browsing ? 'All service guides' : 'Results'}</h2>
              <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setSheet(true)} aria-haspopup="dialog">
                <SlidersHorizontal className="size-4" aria-hidden="true" />Filters{tags.filter(([k]) => k !== 'Search').length > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-primary-700 px-1.5 text-xs text-white">{tags.filter(([k]) => k !== 'Search').length}<span className="sr-only"> active</span></span>}
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="mr-1 text-[15px]" aria-live="polite" aria-atomic="true"><strong>{results.length}</strong> {results.length === 1 ? 'guide' : 'guides'}{f.q && <> for “{f.q}”</>}</p>
              {tags.map(([k, v, rm]) => <FilterTag key={k} label={k} value={v} onRemove={rm} />)}
              {tags.length > 1 && <Button variant="ghost" size="sm" onClick={clearAll}><RotateCcw className="size-3.5" aria-hidden="true" />Clear all</Button>}
            </div>

            <div className="mt-2" key={results.map((r) => r.slug).join()}>
              {results.length === 0 ? (
                <div className="mt-4"><EmptyState title="No guides match" action={<>
                  {tags.length > 0 && <Button variant="secondary" onClick={tags[tags.length - 1][2]}>{tags[tags.length - 1][0] === 'Search' ? 'Clear search' : `Remove ${tags[tags.length - 1][0].toLowerCase()}: ${tags[tags.length - 1][1]}`}</Button>}
                  {tags.length > 1 && <Button onClick={clearAll}>Clear all filters</Button>}
                </>}>
                  {gaps.length ? 'No complete guide yet, but a related topic is recorded as a source gap below.' : 'Try fewer words, a different office, or browse by topic.'}{' '}
                  <ExtLink href={issueUrl(`Missing guide: ${f.q || cat?.name || 'service'}`, location.href)}>Suggest a missing guide</ExtLink>
                </EmptyState></div>
              ) : (
                <ul className="animate-enter divide-y divide-line">
                  {results.map((s) => <ServiceRow key={s.slug} s={s} />)}
                </ul>
              )}
            </div>

            {gaps.length > 0 && (
              <section className="mt-8 rounded-card bg-surface p-5" aria-labelledby="gaps">
                <h2 id="gaps" className="text-lg font-bold">Not yet covered</h2>
                <p className="mt-1 text-muted">These topics have recorded source gaps. No complete procedure is published, so contact the office or check the official website.</p>
                <ul className="mt-3 divide-y divide-line">{gaps.map((g) => <li key={g.title} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5"><Badge tone="warning">Source gap</Badge><span className="font-medium">{g.title}</span><span className="text-sm text-muted">{catName(g.category)}</span></li>)}</ul>
              </section>
            )}
          </div>
        </div>
      </Container>

      <Sheet id="filter-sheet" open={sheet} onClose={() => setSheet(false)} title="Filter guides"
        footer={<div className="flex gap-2">{tags.length > 0 && <Button variant="secondary" onClick={() => { setSheet(false); clearAll() }}>Clear all</Button>}<Button className="flex-1" onClick={() => setSheet(false)}>Show {results.length} {results.length === 1 ? 'guide' : 'guides'}</Button></div>}>
        {filterControls('-m')}
      </Sheet>
    </>
  )
}

function ServiceRow({ s }: { s: Service }) {
  return (
    <ListRow to={serviceHref(s)} title={s.title}
      eyebrow={<><span>{catName(s.category)}</span><Badge tone="primary">{s.access}</Badge>{s.status === 'sourced' ? <StatusBadge status="sourced" /> : <StatusBadge status="illustrative" />}</>}
      meta={<><Meta label="Office">{s.office}</Meta><Meta label="For">{s.audience.join(', ')}</Meta></>}>
      {s.summary}
    </ListRow>
  )
}

const host = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }

export function ServiceDetail() {
  const { category, documentSlug } = useParams()
  const s = services.find((x) => x.slug === documentSlug && x.category === category)
  if (!s) return <NotFound />
  return <Guide key={s.slug} s={s} />
}

function Guide({ s }: { s: Service }) {
  const rel = s.related.map((r) => services.find((x) => x.slug === r)).filter(Boolean) as Service[]
  const officeRec = directory.find((d) => d.office === s.office)
  const back = lastList('services', `/services/${s.category}`)
  const toc: [string, string][] = [['overview', 'Overview'], ['requirements', 'Requirements'], ['steps', 'Steps'], ['fees', 'Fees and time'], ['downloads', 'Downloads'], ['faq', 'Questions'], ['sources', 'Sources'], ...(rel.length ? [['related', 'Related'] as [string, string]] : [])]

  const nextStep = (
    <div className="rounded-card border border-primary-200 bg-white shadow-[0_2px_12px_-6px_rgb(0_41_94/0.25)]">
      <div className="rounded-t-card bg-primary-50 px-5 py-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">Official next step</p></div>
      <div className="space-y-4 p-5">
        {s.portal ? (
          <>
            <p className="text-[15px]">Applications and payments for this service happen on the official portal. You will leave BetterAngeles.</p>
            <LinkButton href={s.portal.href} className="w-full">{s.portal.label}</LinkButton>
            <p className="flex items-start gap-1.5 text-sm text-muted"><CircleCheck className="mt-0.5 size-4 shrink-0 text-success-ink" aria-hidden="true" /><span>External official site · <span className="font-medium text-ink">{host(s.portal.href)}</span></span></p>
          </>
        ) : (
          <>
            <p className="text-[15px]">No online portal is recorded. Prepare the requirements and visit the responsible office. Confirm hours before you go.</p>
            <LinkButton to={officeRec ? `/directory/office/${officeRec.id}` : `/directory?q=${encodeURIComponent(s.office)}`} variant="secondary" className="w-full">Find the office</LinkButton>
          </>
        )}
        <Facts stacked items={[
          ['Responsible office', officeRec ? <TextLink to={`/directory/office/${officeRec.id}`}>{s.office}</TextLink> : s.office],
          ['Where', s.where ?? <Unknown>Address not verified.</Unknown>],
          ['Contact', <Unknown>No verified contact on file.</Unknown>],
          ['Access', s.access],
        ]} />
      </div>
    </div>
  )

  return (
    <>
      <PageHeader eyebrow={catName(s.category)} title={s.title} summary={s.summary}
        crumbs={[{ label: 'Services', to: '/services' }, { label: catName(s.category), to: `/services/${s.category}` }, { label: s.title }]}
        meta={<><StatusBadge status={s.status} date={s.status === 'sourced' ? s.reviewed : undefined} /><Badge tone="primary">{s.access}</Badge><span className="text-muted">Reference date: <span className="text-ink">{s.reviewed}</span></span></>} />
      <Container className="py-6 sm:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><BackLink to={back}>Back to results</BackLink><CopyLinkButton /></div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <div className="space-y-6 lg:hidden">{nextStep}<OnThisPage items={toc} variant="inline" /></div>
          <article className="min-w-0">
            {s.status === 'illustrative'
              ? <Notice tone="warning" title="Illustrative sample">This guide shows the document template. Verify every requirement against the source before you go.</Notice>
              : <Notice tone="success" title={`Sourced from the city’s charter, retrieved ${s.reviewed}`}>Requirements and steps restate the saved charter and form listed under Sources. The official portal remains the authority for changes.</Notice>}
            <Section title="Overview" id="overview"><div className="prose-doc space-y-3"><p>{s.description}</p><p><strong className="font-semibold">Who qualifies:</strong> {s.eligibility}</p></div></Section>
            <Section title="Requirements" id="requirements" divider tagline="Tick items as you prepare them."><Checklist id={s.slug} items={s.requirements} /></Section>
            <Section title="Steps" id="steps" divider>
              <ol className="prose-doc relative space-y-5">
                {s.steps.map((r, i) => <li key={r} className="relative flex gap-4">
                  {i < s.steps.length - 1 && <span className="absolute left-4 top-9 h-[calc(100%-1rem)] w-px bg-line" aria-hidden="true" />}
                  <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-primary-700 text-sm font-bold text-white" aria-hidden="true">{i + 1}</span>
                  <p className="pt-1"><span className="sr-only">Step {i + 1}: </span>{r}</p></li>)}
              </ol>
            </Section>
            <Section title="Fees and processing time" id="fees" divider><Facts items={[['Fees', s.fees], ['Processing time', s.processing]]} /></Section>
            <Section title="Downloads" id="downloads" divider tagline={s.downloads.length ? 'Saved copies are kept for reading. Official links are retained for verification.' : undefined}>
              {s.downloads.length ? <ul className="divide-y divide-line border-y border-line">{s.downloads.map((d) => (
                <li key={d.label} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
                  <span className="grid size-10 shrink-0 place-items-center rounded-ctl bg-surface text-primary-700 ring-1 ring-inset ring-line"><FileText className="size-5" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{d.label} {d.archived && <Badge>Archived</Badge>}</p>
                    <p className="text-sm text-muted">{d.note}</p>
                    <p className="mt-1 text-sm text-muted">{[d.format, d.size, d.date].filter(Boolean).join(' · ')}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                      {d.href && <LinkButton href={d.href} download variant={d.archived ? 'ghost' : 'secondary'} size="sm">Download {d.format ?? 'file'}<span className="sr-only">: {d.label}</span></LinkButton>}
                      {d.official && <ExtLink href={d.official} className="text-sm">Official publication</ExtLink>}
                    </div>
                  </div>
                </li>))}</ul>
                : <Unknown>No downloadable form is recorded for this guide. If the office requires one, it provides it at the counter or on the official website.</Unknown>}
            </Section>
            <Section title="Frequently asked questions" id="faq" divider>{s.faqs.length ? <Accordion items={s.faqs} /> : <Unknown>No supported FAQs for this guide yet.</Unknown>}</Section>
            <Section title="Sources" id="sources" divider>
              <ul className="space-y-2">{s.sources.map((x) => <li key={x.label}><SourceLabel label={x.label} href={x.href} saved={x.saved} date={x.date} /></li>)}</ul>
              <p className="mt-4 text-sm text-muted">Something wrong or out of date? <ExtLink href={issueUrl(`Correction: ${s.title}`, location.href)}>Report a correction</ExtLink></p>
            </Section>
            {rel.length > 0 && <Section title="Related services" id="related" divider><List>{rel.map((r) => <ServiceRow key={r.slug} s={r} />)}</List></Section>}
          </article>
          <aside aria-label="Next step and page sections" className="hidden lg:block">
            <div className="sticky top-24 space-y-8">{nextStep}<OnThisPage items={toc} /></div>
          </aside>
        </div>
      </Container>
    </>
  )
}

/** Device-only preparation checklist. Deliberately separate from any official application status. */
function Checklist({ id, items }: { id: string; items: string[] }) {
  const [done, setDone] = useStored<string[]>('ba:checklist:' + id, [])
  const n = items.filter((i) => done.includes(i)).length
  const pct = items.length ? Math.round((n / items.length) * 100) : 0
  return (
    <div className="max-w-[68ch]">
      <ul className="divide-y divide-line rounded-card border border-line">
        {items.map((r, i) => {
          const on = done.includes(r)
          return <li key={r}><label htmlFor={`${id}-r${i}`} className={cx('flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-surface', on && 'bg-success-bg/40')}>
            <input id={`${id}-r${i}`} type="checkbox" checked={on} onChange={() => setDone(on ? done.filter((x) => x !== r) : [...done, r])} className="mt-1 size-[18px] shrink-0 accent-primary-600" />
            <span className={cx(on && 'text-muted line-through decoration-muted/50')}>{r}</span></label></li>
        })}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="h-2 w-32 overflow-hidden rounded-full bg-line" aria-hidden="true"><div className="h-full rounded-full bg-success-ink transition-[width] duration-300" style={{ width: pct + '%' }} /></div>
        <p className="text-sm font-medium" aria-live="polite">{n} of {items.length} ready</p>
        {n > 0 && <Button variant="ghost" size="sm" onClick={() => setDone([])}>Clear checklist</Button>}
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-sm text-muted"><IdCard className="mt-0.5 size-4 shrink-0" aria-hidden="true" />Saved only on this device. This is your preparation list, not an application, and it does not show official status.</p>
    </div>
  )
}
