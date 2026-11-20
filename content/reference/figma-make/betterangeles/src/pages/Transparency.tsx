import { useParams, useSearchParams } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import {
  Accordion, BackLink, Badge, Button, Card, ChipGroup, Container, DataTable, EmptyState, ExtLink, Facts, FilterTag, Icon, Illustrative, LinkButton, List, ListRow,
  Meta, Notice, PageHeader, SearchField, Section, Segmented, SourceLabel, TextLink, Unknown, lastList, useRememberList,
} from '../ui'
import { issueUrl, recordGroups, records, type TRecord } from '../data'
import NotFound from './NotFound'

const periods = Array.from(new Set(records.map((r) => r.period)))
const explain = [
  { q: 'Why are there no totals?', a: 'Different amount types (approved budgets, contract budgets, revenue and expenditure) measure different things. BetterAngeles never adds them together or computes totals across records.' },
  { q: 'Is an approved budget for the contract a payment?', a: 'No. It is the ceiling set for a procurement. It is not a payment or an expenditure.' },
  { q: 'Can revenue be compared with the budget?', a: 'Not directly. Revenue reports what was collected; budget documents report what was appropriated.' },
  { q: 'Why is project completion not shown?', a: 'Completion appears only when the source supplies a verified percentage. No project record here has one.' },
]

export function Transparency() {
  const [sp, setSp] = useSearchParams()
  useRememberList('transparency')
  const q = sp.get('q') ?? '', type = sp.get('type') ?? '', period = sp.get('period') ?? '', view = (sp.get('view') ?? 'grouped') as 'grouped' | 'table'
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }) }
  const base = records.filter((r) => (!q || (r.title + ' ' + r.amountType + ' ' + r.type).toLowerCase().includes(q.toLowerCase().trim())) && (!period || r.period === period))
  const res = base.filter((r) => !type || r.type === type)
  const filters = !!(q || type || period)
  const clear = () => { const n = new URLSearchParams(); if (sp.get('view')) n.set('view', sp.get('view')!); setSp(n, { replace: true }) }
  return (
    <>
      <PageHeader eyebrow="Public records" title="Transparency" crumbs={[{ label: 'Transparency' }]}
        summary="Budget, revenue, procurement and project records, each with its period, amount type and source document beside it.">
        <form role="search" className="max-w-3xl space-y-4" onSubmit={(e) => e.preventDefault()}>
          <SearchField id="t-q" label="Search records" hideLabel size="lg" placeholder="Search public records" value={q} onChange={(v) => set('q', v)} />
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <div><p className="mb-2 text-sm font-semibold" aria-hidden="true">Financial period</p><Segmented label="Financial period" value={period || 'all'} onChange={(v) => set('period', v === 'all' ? '' : v)} options={[['all', 'All periods'], ...periods.map((p): [string, string] => [p, p])]} /></div>
            <ChipGroup label="Record type" value={type} onChange={(v) => set('type', v === type ? '' : v)} options={[{ value: '', label: 'All', count: base.length }, ...recordGroups.map((g) => ({ value: g.type, label: g.title, count: base.filter((r) => r.type === g.type).length }))]} />
          </div>
        </form>
      </PageHeader>
      <Container className="py-6">
        <Notice tone="warning" title="A limited, illustrative collection">Entries below are placeholders that show the record format. No totals, spending breakdowns or completion percentages are calculated, and different amount types are never added together.</Notice>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-1" aria-live="polite" aria-atomic="true"><strong>{res.length}</strong> {res.length === 1 ? 'record' : 'records'}</p>
            {period && <FilterTag label="Period" value={period} onRemove={() => set('period', '')} />}
            {type && <FilterTag label="Type" value={recordGroups.find((g) => g.type === type)?.title ?? type} onRemove={() => set('type', '')} />}
            {q && <FilterTag label="Search" value={`“${q}”`} onRemove={() => set('q', '')} />}
            {[q, type, period].filter(Boolean).length > 1 && <Button variant="ghost" size="sm" onClick={clear}><RotateCcw className="size-3.5" aria-hidden="true" />Clear all</Button>}
          </div>
          <Segmented label="View" value={view} onChange={(v) => set('view', v === 'grouped' ? '' : v)} options={[['grouped', 'By type'], ['table', 'Table']]} />
        </div>

        <div className="mt-4" key={view + res.length}>
          {!res.length ? <EmptyState title="No records match" action={filters && <Button onClick={clear}>Clear filters</Button>}>This does not mean no such records exist. The collection is limited.</EmptyState> :
            view === 'table' ? <div className="animate-enter"><DataTable wide caption="Public records" rows={res} rowKey={(r) => r.id} cols={[
              { h: 'Record', cell: (r) => <TextLink to={`/transparency/${r.id}`}>{r.title}</TextLink> },
              { h: 'Amount type', cell: (r) => <Badge tone="primary">{r.amountType}</Badge> },
              { h: 'Amount', cell: (r) => r.amount ?? <Unknown>Not recorded</Unknown> },
              { h: 'Period', cell: (r) => r.period },
              { h: 'Reference date', cell: (r) => r.refDate === 'Not recorded' ? <Unknown>Not recorded</Unknown> : r.refDate },
              { h: 'Source', cell: (r) => <ExtLink href={r.sourceHref}>{r.source}</ExtLink> },
            ]} /></div> :
            <div className="animate-enter">{recordGroups.filter((g) => res.some((r) => r.type === g.type)).map((g, i) => (
              <section key={g.type} aria-labelledby={'g-' + g.type} className={i ? 'mt-8' : ''}>
                <div className="mb-2 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-ctl bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-100"><Icon name={g.icon} className="size-[18px]" /></span><div><h2 id={'g-' + g.type} className="text-lg font-bold text-primary-900">{g.title}</h2><p className="text-sm text-muted">{g.blurb}</p></div></div>
                <List>{res.filter((r) => r.type === g.type).map((r) => <RecordRow key={r.id} r={r} />)}</List>
              </section>))}</div>}
        </div>

        <Section title="How to read these records" id="explain" divider className="mt-4"><div className="max-w-3xl"><Accordion items={explain} /></div></Section>
      </Container>
    </>
  )
}
function RecordRow({ r }: { r: TRecord }) {
  return (
    <li className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8">
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2"><Badge tone="primary">{r.amountType}</Badge>{r.illustrative && <Illustrative />}</div>
        <h3 className="text-[17px] font-semibold"><TextLink to={`/transparency/${r.id}`} className="decoration-primary-300">{r.title}</TextLink></h3>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm"><Meta label="Amount">{r.amount ?? <Unknown>Not recorded</Unknown>}</Meta><Meta label="Period">{r.period}</Meta><Meta label="Reference date">{r.refDate}</Meta></p>
      </div>
      <p className="text-sm md:text-right"><span className="text-muted">Source </span><ExtLink href={r.sourceHref}>{r.source}</ExtLink></p>
    </li>
  )
}

export function TransparencyDetail() {
  const r = records.find((x) => x.id === useParams().id)
  if (!r) return <NotFound />
  const group = recordGroups.find((g) => g.type === r.type)
  const others = records.filter((x) => x.period === r.period && x.id !== r.id)
  return (
    <>
      <PageHeader eyebrow={group?.title ?? r.type} title={r.title} crumbs={[{ label: 'Transparency', to: '/transparency' }, { label: r.title }]} meta={<><Badge tone="primary">{r.amountType}</Badge>{r.illustrative && <Illustrative />}<span className="text-muted">Period: <span className="text-ink">{r.period}</span></span></>} />
      <Container className="py-6 sm:py-8">
        <BackLink to={lastList('transparency', '/transparency')}>Back to records</BackLink>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <div className="min-w-0">
            <Card className="flex flex-col gap-3 border-primary-200 bg-primary-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">Source document</p><p className="mt-1 font-semibold">{r.source}</p><p className="text-sm text-muted">Reference date: {r.refDate}. Document title not loaded.</p></div>
              <LinkButton href={r.sourceHref} variant="secondary">Open source site</LinkButton>
            </Card>
            <Section title="Record details" id="details">
              <Facts items={[['Record type', r.type], ['Amount type', r.amountType], ['Amount', r.amount ?? <Unknown>Not recorded</Unknown>], ['Period', r.period], ['Reference date', r.refDate], ['Missing information', <Unknown>Amount, reference date and document title are not loaded in the prototype.</Unknown>]]} />
              <p className="prose-doc mt-4 text-muted">{r.note}</p>
              <div className="mt-4"><SourceLabel label={r.source} href={r.sourceHref} date={r.refDate === 'Not recorded' ? undefined : r.refDate} /></div>
            </Section>
            {others.length > 0 && <Section title={`Other records for ${r.period}`} id="others" divider><List>{others.map((o) => <ListRow key={o.id} to={`/transparency/${o.id}`} title={o.title} eyebrow={<Badge tone="primary">{o.amountType}</Badge>} />)}</List></Section>}
          </div>
          <aside className="space-y-4" aria-label="About this record">
            <Card className="p-5"><h2 className="font-semibold">About this amount type</h2><p className="mt-1 text-sm text-muted">{group?.blurb}</p></Card>
            <Card className="p-5"><h2 className="font-semibold">Spotted an error?</h2><p className="mt-3 text-sm"><ExtLink href={issueUrl(`Transparency: ${r.title}`, location.href)}>Report a correction</ExtLink></p></Card>
          </aside>
        </div>
      </Container>
    </>
  )
}
