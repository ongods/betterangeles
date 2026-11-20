import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Building2, ChevronLeft, ChevronRight, FileText, Gavel, MapPin, RotateCcw, Users } from 'lucide-react'
import {
  BackLink, Badge, Button, Card, ChipGroup, Container, DataTable, EmptyState, ExtLink, Facts, FilterTag, LinkButton, List, ListRow, Meta, Notice,
  OnThisPage, PageHeader, SearchField, Section, SourceLabel, TextLink, Unknown, lastList, useRememberList,
} from '../ui'
import { LINKS, barangays, dirHref, directory, issueUrl, serviceHref, services, servicesFor, type DirRecord, type DirType } from '../data'
import NotFound from './NotFound'

const VERIFY = 'Not shown. No dated, attributable source is loaded.'
function RoleCard({ role, note }: { role: string; note?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-600">{role}</p>
      <p className="mt-2 font-semibold">Office holder</p>
      <p className="text-muted">{VERIFY}</p>
      {note && <p className="mt-2 text-sm text-muted">{note}</p>}
      <p className="mt-3 text-sm"><ExtLink href={LINKS.city}>Verify on angelescity.gov.ph</ExtLink></p>
    </Card>
  )
}

export function Government() {
  const [q, setQ] = useState('')
  const b = barangays.filter((x) => x.name.toLowerCase().includes(q.toLowerCase().trim()))
  const offices = directory.filter((d) => d.type === 'Office')
  return (
    <>
      <PageHeader eyebrow="Local government" title="Government" crumbs={[{ label: 'Government' }]}
        summary="How Angeles City’s local government is organized, and which office handles each service." />
      <Container className="py-6">
        <OnThisPage variant="inline" items={[['exec', 'Executive'], ['leg', 'Legislative'], ['dept', 'Departments'], ['brgy', 'Barangays'], ['docs', 'Documents']]} />
        <div className="mt-6"><Notice tone="warning" title="Officials are not shown as current">Names and terms appear only when backed by a dated, attributable source. Historical records are not treated as current appointments.</Notice></div>

        <Section title="Executive branch" id="exec" icon={Building2} tagline="Leads city administration and implements ordinances.">
          <div className="grid gap-4 sm:grid-cols-2"><RoleCard role="City Mayor" /><RoleCard role="City Administrator" /></div>
        </Section>
        <Section title="Legislative branch" id="leg" icon={Gavel} divider tagline="The Sangguniang Panlungsod enacts city ordinances and resolutions.">
          <div className="grid gap-4 sm:grid-cols-2"><RoleCard role="City Vice Mayor" note="Presiding officer of the Sangguniang Panlungsod." /><RoleCard role="Sangguniang Panlungsod members" note="Council members and committee assignments are not loaded." /></div>
        </Section>

        <Section title="Departments and offices" id="dept" icon={Users} divider tagline="Offices named as responsible in service guides, with the guides they handle." action={<TextLink to="/directory?type=Office">Search the directory</TextLink>}>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {offices.map((d) => {
              const g = servicesFor(d.office!)
              return <li key={d.id}><Card className="flex h-full flex-col p-5">
                <h3 className="font-semibold leading-snug text-primary-900">{d.name}</h3>
                <p className="mt-2 text-sm font-medium text-muted">Handles</p>
                <ul className="mt-1 flex-1 space-y-1 text-[15px]">{g.slice(0, 3).map((s) => <li key={s.slug}><TextLink to={serviceHref(s)}>{s.title}</TextLink></li>)}</ul>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3 text-sm">
                  <TextLink to={`/services?office=${encodeURIComponent(d.office!)}`}>{g.length === 1 ? '1 service guide' : `All ${g.length} service guides`}</TextLink>
                  <TextLink to={dirHref(d)}>Office record</TextLink>
                </div>
              </Card></li>
            })}
          </ul>
        </Section>

        <Section title="Barangays" id="brgy" icon={MapPin} divider tagline="33 barangays, per the PSA Philippine Standard Geographic Code." action={<TextLink to="/government/barangays">Barangay directory</TextLink>}>
          <SearchField id="g-b" label="Search barangays" hideLabel placeholder="Search 33 barangays" value={q} onChange={setQ} className="mb-2 max-w-md" />
          <p className="mb-2 text-sm text-muted" aria-live="polite">{q ? `${b.length} of 33 barangays` : '33 barangays'}</p>
          {b.length ? <ul className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">{b.map((x) => <li key={x.id} className="border-b border-line"><Link className="group flex min-h-11 items-center justify-between gap-2 py-1 text-primary-700" to={`/government/barangays/${x.id}`}><span className="font-medium group-hover:underline">{x.name}</span><ChevronRight className="size-4 text-subtle" aria-hidden="true" /></Link></li>)}</ul>
            : <EmptyState title="No barangay found" action={<Button variant="secondary" onClick={() => setQ('')}>Clear search</Button>}>Check the spelling, or browse the full list.</EmptyState>}
        </Section>

        <Section title="Government documents" id="docs" icon={FileText} divider tagline="Saved copies of official publications, with retrieval dates.">
          <List>
            {[{ t: 'eBPLS Citizen’s Charter', d: 'Business permit procedure, requirements and processing time.', saved: '/documents/angeles-updates-2026-10-15/eBPLS-Citizen-Charter.pdf', off: 'https://angelescity.gov.ph/wp-content/uploads/2026/10/eBPLS-Citizen-Charter.pdf', meta: 'PDF · 165 KB · Retrieved October 15, 2026' },
              { t: 'Business Permit Application Form, revision 33', d: 'BPLD-ABP-001 dated October 1, 2025.', saved: '/documents/angeles-updates-2026-10-15/BPLD-ABP-001-Rev-33.pdf', off: 'https://angelescity.gov.ph/wp-content/uploads/2026/10/BPLD-ABP-001-Rev-33.pdf', meta: 'PDF · 669 KB · Retrieved October 15, 2026' }].map((x) => (
              <li key={x.t} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-semibold">{x.t}</p><p className="text-sm text-muted">{x.d}</p><p className="text-sm text-muted">{x.meta}</p></div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2"><LinkButton href={x.saved} download variant="secondary" size="sm">Download PDF<span className="sr-only">: {x.t}</span></LinkButton><ExtLink href={x.off} className="text-sm">Official publication</ExtLink></div>
              </li>))}
          </List>
          <p className="mt-3 text-sm text-muted">Other offices’ citizen’s charters are not loaded yet. See the <ExtLink href={LINKS.charters}>official citizen’s charter page</ExtLink>.</p>
        </Section>
      </Container>
    </>
  )
}

const TYPES: DirType[] = ['Office', 'Official portal', 'Barangay']
const plural: Record<string, string> = { Office: 'Offices', 'Official portal': 'Official portals', Barangay: 'Barangays' }
export function Directory() {
  const [sp, setSp] = useSearchParams()
  useRememberList('directory')
  const q = sp.get('q') ?? '', type = sp.get('type') ?? ''
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }) }
  const byQ = directory.filter((d) => !q || (d.name + ' ' + d.description + ' ' + d.type).toLowerCase().includes(q.toLowerCase().trim()))
  const res = byQ.filter((d) => !type || d.type === type)
  return (
    <>
      <PageHeader eyebrow="Government" title="City Directory" crumbs={[{ label: 'Government', to: '/government' }, { label: 'City Directory' }]}
        summary="Offices, barangays and official portals in one searchable list. Only verified contact details are shown.">
        <form role="search" className="max-w-2xl space-y-4" onSubmit={(e) => e.preventDefault()}>
          <SearchField id="d-q" label="Search the directory" hideLabel size="lg" placeholder="Search offices, barangays, portals" value={q} onChange={(v) => set('q', v)} />
          <ChipGroup label="Record type" value={type} onChange={(v) => set('type', v === type ? '' : v)} options={[{ value: '', label: 'All', count: byQ.length }, ...TYPES.map((t) => ({ value: t, label: plural[t], count: byQ.filter((d) => d.type === t).length }))]} />
        </form>
      </PageHeader>
      <Container className="py-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-1" aria-live="polite" aria-atomic="true"><strong>{res.length}</strong> {res.length === 1 ? 'record' : 'records'}</p>
          {type && <FilterTag label="Type" value={plural[type]} onRemove={() => set('type', '')} />}
          {q && <FilterTag label="Search" value={`“${q}”`} onRemove={() => set('q', '')} />}
          {q && type && <Button variant="ghost" size="sm" onClick={() => setSp({}, { replace: true })}><RotateCcw className="size-3.5" aria-hidden="true" />Clear all</Button>}
        </div>
        <div className="mt-2" key={q + type}>
          {res.length ? <ul className="animate-enter divide-y divide-line">{res.map((d) => <DirRow key={d.id} d={d} />)}</ul> :
            <div className="mt-4"><EmptyState title="No records match" action={<>{type && <Button variant="secondary" onClick={() => set('type', '')}>Search all types</Button>}<Button onClick={() => setSp({}, { replace: true })}>Clear search</Button></>}>
              {type && byQ.length ? `${byQ.length} ${byQ.length === 1 ? 'record matches' : 'records match'} in other types.` : 'Try a shorter search, such as part of an office or barangay name.'}</EmptyState></div>}
        </div>
      </Container>
    </>
  )
}
function DirRow({ d }: { d: DirRecord }) {
  const g = d.office ? servicesFor(d.office).length : 0
  return <ListRow to={dirHref(d)} title={d.name} eyebrow={<Badge tone={d.type === 'Official portal' ? 'success' : 'primary'}>{d.type}</Badge>}
    meta={d.type === 'Office' ? <Meta label="Service guides">{g}</Meta> : d.href ? <Meta label="Website">{new URL(d.href).hostname.replace('www.', '')}</Meta> : <Meta label="Contact">Not verified</Meta>}>{d.description}</ListRow>
}

/** Address, telephone and hours, shown the same way for every record. Only verified numbers become call links. */
export function ContactFacts({ r, extra = [] }: { r: Pick<DirRecord, 'address' | 'phone' | 'phoneVerified' | 'hours'>; extra?: [string, React.ReactNode][] }) {
  return <Facts items={[
    ...extra,
    ['Address', r.address ?? <Unknown>Not available in the source.</Unknown>],
    ['Telephone', !r.phone ? <Unknown>No verified telephone on record.</Unknown> : r.phoneVerified ? <a className="font-medium text-primary-700 underline" href={`tel:${r.phone}`}>{r.phone}</a> : <span>{r.phone} <Badge tone="warning">Unverified, not a call link</Badge></span>],
    ['Office hours', r.hours ?? <Unknown>Not verified. Confirm before visiting.</Unknown>],
  ]} />
}

export function DirectoryDetail() {
  const { id } = useParams()
  const r = directory.find((d) => d.id === id)
  if (!r) return <NotFound />
  const g = r.office ? servicesFor(r.office) : []
  return (
    <>
      <PageHeader eyebrow={r.type} title={r.name} summary={r.description} crumbs={[{ label: 'Government', to: '/government' }, { label: 'City Directory', to: '/directory' }, { label: r.name }]} />
      <Container className="py-6 sm:py-8">
        <BackLink to={lastList('directory', '/directory')}>Back to directory</BackLink>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <div className="min-w-0">
            {r.href && <div className="mb-6"><Notice tone="info" title="Official website" action={<LinkButton href={r.href}>Continue to official site</LinkButton>}>Transactions happen on {new URL(r.href).hostname.replace('www.', '')}. You will leave BetterAngeles.</Notice></div>}
            <Section title="Contact details" id="contact" className="!pt-0"><ContactFacts r={r} extra={[['Record type', r.type], ['Directory ID', <code className="text-sm">{r.id}</code>]]} /></Section>
            {g.length > 0 && <Section title="Service guides handled here" id="guides" divider><List>{g.map((s) => <ListRow key={s.slug} to={serviceHref(s)} title={s.title} eyebrow={<Badge tone="primary">{s.access}</Badge>}>{s.summary}</ListRow>)}</List></Section>}
            <Section title="Source" id="source" divider><SourceLabel label={r.href ? 'Official site' : 'BetterAngeles prototype directory'} href={r.href} date={r.asOf} /></Section>
          </div>
          <aside className="space-y-4 lg:pt-1" aria-label="Related actions">
            <Card className="p-5"><h2 className="font-semibold">Location</h2><p className="mt-1 text-sm text-muted">No validated coordinates, so this record is not marked on the map.</p><div className="mt-3"><LinkButton to={`/map?select=${r.id}`} variant="secondary" size="sm">Open in map list</LinkButton></div></Card>
            <Card className="p-5"><h2 className="font-semibold">Help keep this accurate</h2><p className="mt-1 text-sm text-muted">Know the verified address or hours? Share an official source.</p><p className="mt-3 text-sm"><ExtLink href={issueUrl(`Directory: ${r.name}`, location.href)}>Report a correction</ExtLink></p></Card>
          </aside>
        </div>
      </Container>
    </>
  )
}

export function Barangays() {
  const [sp, setSp] = useSearchParams()
  useRememberList('barangays')
  const q = sp.get('q') ?? ''
  const rows = barangays.filter((x) => x.name.toLowerCase().includes(q.toLowerCase().trim()))
  return (
    <>
      <PageHeader eyebrow="Government" title="Barangay directory" crumbs={[{ label: 'Government', to: '/government' }, { label: 'Barangays' }]} meta={<SourceLabel label="PSA PSGC" href={LINKS.psa} />}
        summary="The 33 barangays of Angeles City. Identifiers and population figures appear once imported from the PSA source.">
        <form role="search" className="max-w-md" onSubmit={(e) => e.preventDefault()}><SearchField id="b-q" label="Search barangays" hideLabel placeholder="Search barangays" value={q} onChange={(v) => setSp(v ? { q: v } : {}, { replace: true })} /></form>
      </PageHeader>
      <Container className="space-y-4 py-6">
        <Notice tone="warning" compact>PSGC codes, dated population and officials are not loaded yet. Telephone entries are unverified.</Notice>
        <p aria-live="polite"><strong>{rows.length}</strong> of 33 barangays</p>
        {rows.length ? <DataTable caption="Barangays of Angeles City" rows={rows} rowKey={(b) => b.id} cols={[
          { h: 'Barangay', cell: (b) => <Link className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-[3px] hover:decoration-primary-700" to={`/government/barangays/${b.id}`}>{b.name}</Link> },
          { h: 'PSGC ID', cell: () => <Unknown>Not loaded</Unknown> },
          { h: 'Population (census year)', cell: () => <Unknown>Not loaded</Unknown> },
          { h: 'Contact', cell: () => <Unknown>Unverified</Unknown> },
        ]} /> : <EmptyState title="No barangay found" action={<Button variant="secondary" onClick={() => setSp({}, { replace: true })}>Clear search</Button>}>Check the spelling. Some names include a district, such as “Santo Rosario (Poblacion)”.</EmptyState>}
      </Container>
    </>
  )
}
export function BarangayDetail() {
  const id = useParams().id
  const i = barangays.findIndex((x) => x.id === id)
  if (i < 0) return <NotFound />
  const b = barangays[i], prev = barangays[i - 1], next = barangays[i + 1]
  const clearance = services.find((s) => s.slug === 'barangay-clearance')!
  return (
    <>
      <PageHeader eyebrow="Barangay" title={`Barangay ${b.name}`} summary="Angeles City, Pampanga" crumbs={[{ label: 'Government', to: '/government' }, { label: 'Barangays', to: '/government/barangays' }, { label: b.name }]} />
      <Container className="py-6 sm:py-8">
        <BackLink to={lastList('barangays', '/government/barangays')}>Back to barangays</BackLink>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <div className="min-w-0">
            <Section title="Barangay record" id="b-rec" className="!pt-0">
              <Facts items={[['PSGC identifier', <Unknown>Not loaded in this prototype</Unknown>], ['Population and census year', <Unknown>Not loaded in this prototype</Unknown>], ['Barangay officials', <Unknown>Not verified as current</Unknown>]]} />
              <div className="mt-3"><SourceLabel label="PSA PSGC" href={LINKS.psa} /></div>
            </Section>
            <Section title="Barangay hall" id="b-con" divider><ContactFacts r={{}} /></Section>
            <Section title="Common barangay services" id="b-svc" divider><List><ListRow to={serviceHref(clearance)} title={clearance.title} eyebrow={<Badge tone="primary">{clearance.access}</Badge>}>{clearance.summary}</ListRow></List></Section>
          </div>
          <aside className="space-y-4 lg:pt-1" aria-label="Related actions">
            <Card className="p-5"><h2 className="font-semibold">Location</h2><p className="mt-1 text-sm text-muted">Boundaries and the hall location are not validated, so nothing is drawn on the map.</p><div className="mt-3"><LinkButton to={`/map?select=brgy-${b.id}`} variant="secondary" size="sm">Open in map list</LinkButton></div></Card>
            <Card className="p-5"><h2 className="font-semibold">Help keep this accurate</h2><p className="mt-3 text-sm"><ExtLink href={issueUrl(`Barangay: ${b.name}`, location.href)}>Report a correction</ExtLink></p></Card>
          </aside>
        </div>
        <nav aria-label="Other barangays" className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? <Link to={`/government/barangays/${prev.id}`} className="group flex items-center gap-2 rounded-ctl p-2 hover:bg-surface"><ChevronLeft className="size-5 text-subtle" aria-hidden="true" /><span><span className="block text-sm text-muted">Previous</span><span className="font-semibold text-primary-700 group-hover:underline">{prev.name}</span></span></Link> : <span />}
          {next && <Link to={`/government/barangays/${next.id}`} className="group flex items-center justify-end gap-2 rounded-ctl p-2 text-right hover:bg-surface"><span><span className="block text-sm text-muted">Next</span><span className="font-semibold text-primary-700 group-hover:underline">{next.name}</span></span><ChevronRight className="size-5 text-subtle" aria-hidden="true" /></Link>}
        </nav>
      </Container>
    </>
  )
}
