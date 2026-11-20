import { type ReactNode, type Ref, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BookMarked, BookUser, Building2, Check, ChevronDown, ChevronRight, Circle, CircleAlert, CircleCheck, Construction, ExternalLink, FileDown,
  FileText, FlaskConical, Gavel, GraduationCap, HandHeart, HeartPulse, House, Info, Landmark, Leaf, Link2, Loader2, Map as MapIcon, MapPinned,
  Receipt, Search, SearchX, Siren, Store, Trash2, TrendingUp, TriangleAlert, Wallet, Wheat, X, type LucideIcon,
} from 'lucide-react'
import { activeChild, sectionFor } from './nav'

export const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ')

// Icons referenced by name from data. Explicit registry keeps the bundle small; add names here when data references new ones.
const icons: Record<string, LucideIcon> = {
  BookUser, Building2, CircleAlert, CircleCheck, Construction, FileText, Gavel, GraduationCap, HandHeart, HeartPulse, Home: House, Info, Landmark,
  Leaf, Map: MapIcon, MapPinned, Receipt, Siren, Store, Trash2, TrendingUp, TriangleAlert, Wallet, Wheat,
}
export function Icon({ name, className = 'size-5' }: { name: string; className?: string }) {
  const C = icons[name] ?? Circle
  return <C className={className} aria-hidden="true" />
}
export const Container = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
)

/* ---------- Actions ---------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'md' | 'sm'
const btnBase = 'inline-flex items-center justify-center gap-2 rounded-ctl font-semibold whitespace-nowrap transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-55'
const btnSize: Record<Size, string> = { md: 'min-h-11 px-4 text-[15px]', sm: 'min-h-9 px-3 text-sm' }
const btnVariant: Record<Variant, string> = {
  primary: 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 active:bg-primary-700',
  secondary: 'border border-primary-500 bg-white text-primary-700 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'text-primary-700 hover:bg-primary-50 active:bg-primary-100',
  inverse: 'bg-white text-primary-800 shadow-sm hover:bg-primary-50 active:bg-primary-100',
}
export const buttonCls = (variant: Variant = 'primary', size: Size = 'md', className?: string) => cx(btnBase, btnSize[size], btnVariant[variant], className)
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>

export function Button({ variant = 'primary', size = 'md', loading, className, children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean }) {
  return (
    <button type="button" {...p} disabled={p.disabled || loading} aria-busy={loading || undefined} className={buttonCls(variant, size, className)}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{children}
    </button>
  )
}
/** Internal route, external official site, or file download, all sharing button styling. */
export function LinkButton({ to, href, download, variant = 'primary', size = 'md', children, className, state }: { to?: string; href?: string; download?: boolean; variant?: Variant; size?: Size; children: ReactNode; className?: string; state?: unknown }) {
  const c = buttonCls(variant, size, className)
  if (href && download) return <a href={href} download className={c}><FileDown className="size-4" aria-hidden="true" />{children}</a>
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={c}>{children}<ExternalLink className="size-4" aria-hidden="true" /><NewTab /></a>
  return <Link to={to!} state={state} className={c}>{children}</Link>
}
const linkCls = 'font-medium text-primary-700 underline decoration-primary-300 underline-offset-[3px] transition-colors hover:text-primary-800 hover:decoration-primary-700'
export const TextLink = ({ to, children, className, state }: { to: string; children: ReactNode; className?: string; state?: unknown }) => (
  <Link to={to} state={state} className={cx(linkCls, className)}>{children}</Link>
)
export const ExtLink = ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={cx(linkCls, 'inline-flex items-baseline gap-1', className)}>
    {children}<ExternalLink className="size-3.5 shrink-0 self-center" aria-hidden="true" /><NewTab />
  </a>
)
/** "Back to results" style link with a leading chevron. */
export const BackLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline"><ChevronRight className="size-4 rotate-180" aria-hidden="true" />{children}</Link>
)

/* ---------- Status ---------- */
export type Tone = 'info' | 'warning' | 'success' | 'danger'
const toneCls: Record<Tone, string> = {
  info: 'border-primary-200 bg-info-bg text-info-ink', warning: 'border-warning-line bg-warning-bg text-warning-ink',
  success: 'border-success-line bg-success-bg text-success-ink', danger: 'border-danger-line bg-danger-bg text-danger-ink',
}
const toneIcon: Record<Tone, LucideIcon> = { info: Info, warning: TriangleAlert, success: CircleCheck, danger: CircleAlert }
export function Notice({ tone = 'info', title, children, action, compact, live, className }: { tone?: Tone; title?: string; children?: ReactNode; action?: ReactNode; compact?: boolean; live?: boolean; className?: string }) {
  const I = toneIcon[tone]
  return (
    <div role={live ? (tone === 'danger' ? 'alert' : 'status') : undefined} className={cx('flex animate-enter gap-3 rounded-ctl border text-[15px]', compact ? 'px-3 py-2.5' : 'p-4', toneCls[tone], className)}>
      <I className={cx('shrink-0', compact ? 'mt-0.5 size-4' : 'mt-0.5 size-5')} aria-hidden="true" />
      <div className="min-w-0 flex-1">{title && <p className="font-semibold">{title}</p>}{children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}{action && <div className="mt-3 flex flex-wrap gap-2">{action}</div>}</div>
    </div>
  )
}
export type BadgeTone = 'neutral' | 'primary' | Tone
const badgeTone: Record<BadgeTone, string> = { neutral: 'bg-slate-100 text-slate-700 ring-slate-200', primary: 'bg-primary-50 text-primary-800 ring-primary-200', info: 'bg-info-bg text-info-ink ring-primary-200', warning: 'bg-warning-bg text-warning-ink ring-warning-line', success: 'bg-success-bg text-success-ink ring-success-line', danger: 'bg-danger-bg text-danger-ink ring-danger-line' }
export const Badge = ({ children, tone = 'neutral', icon }: { children: ReactNode; tone?: BadgeTone; icon?: LucideIcon }) => {
  const I = icon
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset', badgeTone[tone])}>{I && <I className="size-3.5" aria-hidden="true" />}{children}</span>
}
/** Source status: a sourced guide shows its reference date; samples are always labelled. */
export const StatusBadge = ({ status, date }: { status: 'sourced' | 'illustrative'; date?: string }) =>
  status === 'sourced' ? <Badge tone="success" icon={CircleCheck}>Sourced{date ? ` · ${date}` : ''}</Badge> : <Badge tone="warning" icon={FlaskConical}>Illustrative sample</Badge>
export const Illustrative = () => <StatusBadge status="illustrative" />
export const SourceLabel = ({ label, href, saved, date }: { label: string; href?: string; saved?: string; date?: string }) => (
  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
    <BookMarked className="size-4 shrink-0" aria-hidden="true" /><span>Source:</span>
    {href ? <ExtLink href={href}>{label}</ExtLink> : <span className="font-medium text-ink">{label}</span>}
    {saved && <><span aria-hidden="true">·</span><a href={saved} className={linkCls}>Saved copy<span className="sr-only"> of {label}</span></a></>}
    {date && <><span aria-hidden="true">·</span><span>{date}</span></>}
  </p>
)
export const Spinner = ({ label = 'Loading' }: { label?: string }) => <Loader2 className="size-4 animate-spin" aria-label={label} />

/* ---------- Form fields ---------- */
/** slate-500 borders keep the 3:1 non-text contrast required for field boundaries. */
export const fieldCls = 'h-11 w-full rounded-ctl border border-line-strong bg-white px-3 text-[15px] text-ink transition-colors placeholder:text-subtle hover:border-primary-700 focus:border-primary-500 aria-[invalid=true]:border-danger-ink'
export const Label = ({ htmlFor, children, hidden }: { htmlFor: string; children: ReactNode; hidden?: boolean }) => (
  <label htmlFor={htmlFor} className={hidden ? 'sr-only' : 'mb-1.5 block text-sm font-semibold text-ink'}>{children}</label>
)
export function SearchField({ id, label, hideLabel, value, onChange, placeholder, size = 'md', helper, inputRef, autoFocus, className, onKeyDown }: {
  id: string; label: string; hideLabel?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; size?: 'md' | 'lg'; helper?: ReactNode
  inputRef?: Ref<HTMLInputElement>; autoFocus?: boolean; className?: string; onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}) {
  const own = useRef<HTMLInputElement>(null)
  const setRef = (el: HTMLInputElement | null) => { own.current = el; if (typeof inputRef === 'function') inputRef(el); else if (inputRef) (inputRef as React.RefObject<HTMLInputElement | null>).current = el }
  return (
    <div className={className}>
      <Label htmlFor={id} hidden={hideLabel}>{label}</Label>
      <div className="relative">
        <Search className={cx('pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted', size === 'lg' ? 'left-4 size-5' : 'left-3.5 size-[18px]')} aria-hidden="true" />
        <input ref={setRef} id={id} type="search" value={value} autoFocus={autoFocus} onKeyDown={onKeyDown} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-describedby={helper ? id + '-h' : undefined} autoComplete="off"
          className={cx(fieldCls, size === 'lg' ? 'h-14 pl-12 pr-12 text-base' : 'pl-10 pr-10')} />
        {value && <button type="button" onClick={() => { onChange(''); own.current?.focus() }} className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted hover:bg-surface hover:text-ink" aria-label={`Clear ${label.toLowerCase()}`}><X className="size-4" aria-hidden="true" /></button>}
      </div>
      {helper && <p id={id + '-h'} className="mt-1.5 text-sm text-muted">{helper}</p>}
    </div>
  )
}
export function SelectField({ label, id, value, onChange, options, all, helper }: { label: string; id: string; value: string; onChange: (v: string) => void; options: [string, string][]; all: string; helper?: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={helper ? id + '-h' : undefined} className={cx(fieldCls, 'appearance-none pr-9')}>
          <option value="">{all}</option>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
      {helper && <p id={id + '-h'} className="mt-1.5 text-sm text-muted">{helper}</p>}
    </div>
  )
}
export function TextField({ id, label, value, onChange, placeholder, helper, error, inputMode }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; helper?: string; error?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'] }) {
  const desc = [helper && id + '-h', error && id + '-e'].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} value={value} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-invalid={!!error || undefined} aria-describedby={desc} className={fieldCls} />
      {error && <p id={id + '-e'} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger-ink"><CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{error}</p>}
      {helper && <p id={id + '-h'} className="mt-1.5 text-sm text-muted">{helper}</p>}
    </div>
  )
}

/* ---------- Selection ---------- */
/** Single-choice chip row. Selected chips carry a check mark so state does not rely on colour. */
export function ChipGroup<T extends string>({ label, value, onChange, options, hideLabel }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string; count?: number; disabled?: boolean }[]; hideLabel?: boolean }) {
  return (
    <div role="group" aria-label={label}>
      {!hideLabel && <p className="mb-2 text-sm font-semibold text-ink" aria-hidden="true">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.value
          return <button key={o.value} type="button" aria-pressed={on} disabled={o.disabled} onClick={() => onChange(o.value)}
            className={cx('inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors disabled:opacity-50', on ? 'border-primary-700 bg-primary-700 text-white' : 'border-line-strong/50 bg-white text-ink hover:border-primary-500 hover:bg-primary-50')}>
            {on && <Check className="size-3.5" aria-hidden="true" />}{o.label}{o.count !== undefined && <span className={cx('tabular-nums', on ? 'text-primary-100' : 'text-muted')}>{o.count}</span>}
          </button>
        })}
      </div>
    </div>
  )
}
export const FilterTag = ({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) => (
  <button type="button" onClick={onRemove} className="inline-flex min-h-8 max-w-full animate-enter items-center gap-1.5 rounded-full bg-primary-50 py-1 pl-3 pr-2 text-sm text-primary-800 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-primary-100">
    <span className="truncate"><span className="text-primary-700">{label}:</span> <span className="font-semibold">{value}</span></span>
    <X className="size-4 shrink-0" aria-hidden="true" /><span className="sr-only">, remove filter</span>
  </button>
)
export function Segmented<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-ctl border border-line-strong/60 bg-white p-0.5">
      {options.map(([v, l]) => <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={cx('min-h-9 rounded-[6px] px-3.5 text-sm font-semibold transition-colors', value === v ? 'bg-primary-800 text-white' : 'text-primary-800 hover:bg-primary-50')}>{l}</button>)}
    </div>
  )
}

/* ---------- Content ---------- */
/** Key/value list. Stacks on narrow screens instead of scrolling sideways. */
export const Facts = ({ items, stacked, className }: { items: [string, ReactNode][]; stacked?: boolean; className?: string }) => (
  <dl className={cx('divide-y divide-line border-y border-line', className)}>
    {items.map(([k, v]) => <div key={k} className={cx('grid gap-1 py-3', !stacked && 'sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-4')}><dt className="text-sm font-medium text-muted">{k}</dt><dd className="min-w-0 break-words">{v}</dd></div>)}
  </dl>
)
export const Unknown = ({ children }: { children: ReactNode }) => <span className="text-muted">{children}</span>
export const Card = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cx('rounded-card border border-line bg-white', className)}>{children}</div>
/** Whole-card link for grouped navigation (categories, offices, portals). */
export function CardLink({ to, href, children, className }: { to?: string; href?: string; children: ReactNode; className?: string }) {
  const c = cx('group relative flex h-full rounded-card border border-line bg-white p-4 transition-[border-color,box-shadow,background-color] duration-150 hover:border-primary-500 hover:shadow-[0_2px_10px_-4px_rgb(0_41_94/0.25)] active:bg-primary-50', className)
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={c}>{children}<NewTab /></a>
  return <Link to={to!} className={c}>{children}</Link>
}
/** Scannable link row used by every result list. */
export function ListRow({ to, title, eyebrow, meta, children, aside, onClick, selected, headingLevel = 3, id }: { to?: string; title: ReactNode; eyebrow?: ReactNode; meta?: ReactNode; children?: ReactNode; aside?: ReactNode; onClick?: () => void; selected?: boolean; headingLevel?: 2 | 3; id?: string }) {
  // Buttons may only contain phrasing content, so the button variant uses spans and no heading.
  const W = to ? 'div' : 'span'
  const H = to ? (`h${headingLevel}` as 'h3') : 'span'
  const inner = (
    <>
      <W className="block min-w-0 flex-1">
        {eyebrow && <W className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted">{eyebrow}</W>}
        <H className="block text-[17px] font-semibold leading-snug text-primary-700 decoration-primary-300 underline-offset-[3px] group-hover:underline">{title}</H>
        {children && <W className="mt-1 block text-muted">{children}</W>}
        {meta && <W className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink">{meta}</W>}
      </W>
      {aside}
      <ChevronRight className="mt-1 size-5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary-600" aria-hidden="true" />
    </>
  )
  const c = cx('group -mx-3 flex w-[calc(100%+1.5rem)] gap-3 rounded-ctl px-3 py-4 text-left transition-colors hover:bg-surface', selected && 'bg-primary-50 ring-1 ring-inset ring-primary-200 hover:bg-primary-50')
  return <li>{to ? <Link id={id} to={to} className={c}>{inner}</Link> : <button id={id} type="button" onClick={onClick} aria-pressed={selected} className={c}>{inner}</button>}</li>
}
export const List = ({ children, label }: { children: ReactNode; label?: string }) => <ul aria-label={label} className="divide-y divide-line border-y border-line">{children}</ul>
export const Meta = ({ label, children }: { label: string; children: ReactNode }) => <span><span className="text-muted">{label}:</span> {children}</span>

/** Table on wide screens, stacked records on phones, so nothing scrolls sideways. */
export function DataTable<T>({ caption, rows, cols, rowKey, wide }: { caption: string; rows: T[]; rowKey: (r: T) => string; cols: { h: string; cell: (r: T) => ReactNode }[]; wide?: boolean }) {
  // Wide tables switch to the table layout later; horizontal scroll is only a safety net, never clipping.
  return (
    <>
      <div className={cx('hidden overflow-x-auto rounded-card border border-line', wide ? 'lg:block' : 'md:block')}>
        <table className="w-full border-collapse text-left text-[15px]"><caption className="sr-only">{caption}</caption>
          <thead className="bg-surface text-sm text-muted"><tr>{cols.map((c) => <th key={c.h} scope="col" className="px-4 py-3 font-semibold">{c.h}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">{rows.map((r) => <tr key={rowKey(r)} className="align-top transition-colors hover:bg-surface/60">{cols.map((c, i) => i === 0 ? <th key={c.h} scope="row" className="px-4 py-3 font-medium">{c.cell(r)}</th> : <td key={c.h} className="px-4 py-3">{c.cell(r)}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <ul aria-label={caption} className={cx('divide-y divide-line border-y border-line', wide ? 'lg:hidden' : 'md:hidden')}>
        {rows.map((r) => <li key={rowKey(r)} className="py-4"><div className="font-semibold">{cols[0].cell(r)}</div>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">{cols.slice(1).map((c) => <div key={c.h} className="contents"><dt className="text-muted">{c.h}</dt><dd>{c.cell(r)}</dd></div>)}</dl></li>)}
      </ul>
    </>
  )
}
export const Skeleton = ({ lines = 3 }: { lines?: number }) => (
  <div role="status" aria-label="Loading" className="space-y-3">{Array.from({ length: lines }).map((_, i) => <div key={i} className="skeleton h-5" style={{ width: `${95 - i * 12}%` }} />)}<span className="sr-only">Loading…</span></div>
)
export const EmptyState = ({ title, children, action, icon: I = SearchX }: { title: string; children?: ReactNode; action?: ReactNode; icon?: LucideIcon }) => (
  <div className="animate-enter rounded-card border border-dashed border-line-strong/60 bg-surface/50 px-6 py-8 text-center">
    <I className="mx-auto size-8 text-subtle" aria-hidden="true" /><h3 className="mt-2 text-lg font-semibold">{title}</h3>
    {children && <div className="mx-auto mt-1 max-w-md text-muted">{children}</div>}{action && <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div>}
  </div>
)
export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 py-3 font-semibold text-ink hover:text-primary-700">{f.q}<ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></summary>
          <div className="animate-enter pb-4 text-muted">{f.a}</div>
        </details>
      ))}
    </div>
  )
}

/* ---------- Page structure ---------- */
export type Crumb = { label: string; to?: string }
export function PageHeader({ eyebrow, title, summary, crumbs, meta, children, actions }: { eyebrow?: ReactNode; title: string; summary?: ReactNode; crumbs?: Crumb[]; meta?: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  const { pathname } = useLocation()
  const section = sectionFor(pathname)
  const current = section && activeChild(pathname, section)
  const list = crumbs ?? []
  useEffect(() => { document.title = `${title} · BetterAngeles` }, [title])
  return (
    <div className="border-b border-line bg-surface">
      <Container className={cx('pt-6 sm:pt-8', section ? 'pb-0' : 'pb-8 sm:pb-10')}>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted">
            <li><Link to="/" className="underline-offset-2 hover:text-primary-700 hover:underline">Home</Link></li>
            {list.map((c, i) => (<li key={i} className="flex min-w-0 items-center gap-1.5"><ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />{c.to && i < list.length - 1 ? <Link to={c.to} className="underline-offset-2 hover:text-primary-700 hover:underline">{c.label}</Link> : <span aria-current="page" className="truncate font-medium text-ink">{c.label}</span>}</li>))}
          </ol>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="min-w-0 max-w-3xl flex-1 basis-[28rem]">
            {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-600">{eyebrow}</p>}
            <h1 className="break-words text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">{title}</h1>
            {summary && <p className="mt-3 max-w-[65ch] text-lg text-muted">{summary}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
        {meta && <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">{meta}</div>}
        {children && <div className="mt-6">{children}</div>}
        {section && (
          <nav aria-label={`${section.label} pages`} className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex gap-1">{section.children!.map(([to, l]) => {
              const on = to === current
              return <li key={to}><Link to={to} aria-current={on ? 'page' : undefined} className={cx('inline-flex min-h-11 items-center border-b-[3px] px-3 text-[15px] font-semibold whitespace-nowrap transition-colors', on ? 'border-primary-500 text-primary-800' : 'border-transparent text-muted hover:border-primary-200 hover:text-primary-700')}>{l}</Link></li>
            })}</ul>
          </nav>
        )}
      </Container>
    </div>
  )
}
export const Section = ({ title, id, tagline, icon, action, children, className, divider }: { title: string; id?: string; tagline?: ReactNode; icon?: LucideIcon; action?: ReactNode; children: ReactNode; className?: string; divider?: boolean }) => {
  const I = icon
  return (
    <section aria-labelledby={id} className={cx('py-8', divider && 'border-t border-line', className)}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-start gap-3">
          {I && <span className="grid size-10 shrink-0 place-items-center rounded-ctl bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-100"><I className="size-5" aria-hidden="true" /></span>}
          <div className="min-w-0"><h2 id={id} tabIndex={-1} className="text-xl font-bold text-primary-900 outline-none">{title}</h2>{tagline && <p className="mt-0.5 text-[15px] text-muted">{tagline}</p>}</div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export function jumpTo(id: string) {
  const el = document.getElementById(id); if (!el) return
  el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' })
  const h = el.matches('h2,h3') ? el : el.querySelector<HTMLElement>('h2,h3'); h?.focus({ preventScroll: true })
  history.replaceState(history.state, '', '#' + id)
}
/** In-page navigation with the current section highlighted while scrolling. */
export function OnThisPage({ items, variant = 'aside' }: { items: [string, string][]; variant?: 'aside' | 'inline' }) {
  const [active, setActive] = useState(items[0]?.[0])
  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive(v.target.id) }, { rootMargin: '-96px 0px -60% 0px' })
    els.forEach((e) => io.observe(e)); return () => io.disconnect()
  }, [items])
  const links = (
    <ul className={variant === 'aside' ? 'space-y-0.5 border-l border-line' : 'flex flex-wrap gap-x-1 gap-y-1'}>
      {items.map(([id, l]) => <li key={id}><a href={'#' + id} onClick={(e) => { e.preventDefault(); setActive(id); jumpTo(id) }} aria-current={active === id ? 'location' : undefined}
        className={variant === 'aside' ? cx('-ml-px block border-l-2 py-1.5 pl-3 text-sm transition-colors', active === id ? 'border-primary-500 font-semibold text-primary-800' : 'border-transparent text-muted hover:border-line-strong hover:text-ink') : cx('inline-flex min-h-9 items-center rounded-full px-3 text-sm font-medium transition-colors', active === id ? 'bg-primary-50 text-primary-800 ring-1 ring-inset ring-primary-200' : 'text-muted hover:bg-surface hover:text-ink')}>{l}</a></li>)}
    </ul>
  )
  return <nav aria-label="On this page">{variant === 'aside' && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">On this page</p>}{links}</nav>
}

/* ---------- Overlay ---------- */
/** Native modal dialog (focus containment, Escape and inert background come from the platform). */
export function Sheet({ open, onClose, title, children, footer, id }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; id?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const d = ref.current; if (!d) return; if (open && !d.open) d.showModal(); if (!open && d.open) d.close() }, [open])
  return (
    <dialog id={id} ref={ref} aria-labelledby={id + '-t'} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose() }}
      className="m-0 mt-auto max-h-[88dvh] w-full max-w-none animate-sheet rounded-t-2xl bg-white p-0 text-ink shadow-2xl sm:m-auto sm:max-w-lg sm:rounded-2xl">
      <div className="flex max-h-[88dvh] flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3"><h2 id={id + '-t'} className="text-lg font-bold">{title}</h2><button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-md hover:bg-surface" aria-label="Close"><X className="size-5" aria-hidden="true" /></button></div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-line px-5 py-3">{footer}</div>}
      </div>
    </dialog>
  )
}

/* ---------- Hooks ---------- */
/** JSON state persisted to localStorage (device only). */
export function useStored<T>(key: string, init: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => { try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init } catch { return init } })
  const set = useCallback((n: T) => { setV(n); try { localStorage.setItem(key, JSON.stringify(n)) } catch { /* storage unavailable: keep in memory */ } }, [key])
  return [v, set]
}
/** Remember the current list URL so detail pages can offer "Back to results" with filters intact. */
export function useRememberList(key: string) {
  const { pathname, search } = useLocation()
  useEffect(() => { try { sessionStorage.setItem('ba:list:' + key, pathname + search) } catch { /* ignore */ } }, [key, pathname, search])
}
export const lastList = (key: string, fallback: string) => { try { return sessionStorage.getItem('ba:list:' + key) ?? fallback } catch { return fallback } }
export function CopyLinkButton() {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')
  useEffect(() => { if (state === 'idle') return; const t = setTimeout(() => setState('idle'), 2500); return () => clearTimeout(t) }, [state])
  return (
    <span className="inline-flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard?.writeText(location.href).then(() => setState('ok'), () => setState('fail')) ?? setState('fail')}>
        {state === 'ok' ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}{state === 'ok' ? 'Link copied' : 'Copy link'}
      </Button>
      <span role="status" className="text-sm text-muted">{state === 'fail' ? 'Copy failed. Use the address bar.' : ''}</span>
    </span>
  )
}
