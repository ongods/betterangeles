import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ExternalLink, Landmark, Menu, Search, X } from 'lucide-react'
import { NAV, isActive, under } from './nav'
import { Container, cx } from './ui'
import { LINKS, REPO, REPO_ISSUES, categories } from './data'

const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>

export function Shell({ children }: { children: ReactNode }) {
  const { pathname, hash, state } = useLocation()
  const [open, setOpen] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  // Route change: close the menu, honour in-page anchors, otherwise start at the top with focus on main.
  useEffect(() => {
    setOpen(false)
    // 'instant' overrides the CSS smooth-scroll default so page changes never animate.
    window.scrollTo({ top: 0, behavior: 'instant' })
    // The header search shortcut hands focus to the page's search field instead of main.
    if (!(state as { focusSearch?: boolean } | null)?.focusSearch) document.getElementById('main')?.focus({ preventScroll: true })
    if (!hash) return
    // Lazy pages may render after this effect, so look for the anchor for up to two seconds.
    let tries = 0
    const find = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) { target.scrollIntoView({ behavior: 'instant' }); (target.matches('h2,h3') ? target : target.querySelector<HTMLElement>('h2,h3'))?.focus({ preventScroll: true }) }
      else if (tries++ < 20) t = window.setTimeout(find, 100)
    }
    let t = window.setTimeout(find, 0)
    return () => clearTimeout(t)
  }, [pathname, hash]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mobile menu: lock page scroll, focus the first link, close on Escape (returning focus) or when focus leaves.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('a')?.focus()
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus() } }
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', key) }
  }, [open])

  const desktopItem = (on: boolean) => cx('relative inline-flex h-16 items-center px-2 text-sm font-medium whitespace-nowrap transition-colors xl:px-3 xl:text-[15px]',
    on ? 'text-white after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:rounded-t after:bg-primary-300 xl:after:inset-x-3' : 'text-primary-100 hover:text-white')

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-[100] rounded bg-white px-4 py-2 font-semibold text-primary-800 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Skip to main content</a>
      <div className="on-dark bg-primary-900 text-[13px] text-primary-100">
        <Container className="flex min-h-9 items-center justify-between gap-4 py-1.5">
          <p>Community guide. Not the official city government website.</p>
          <ul className="hidden shrink-0 items-center gap-5 md:flex">
            <li><a className="inline-flex items-center gap-1 hover:text-white hover:underline" href={LINKS.city} target="_blank" rel="noopener noreferrer">angelescity.gov.ph<ExternalLink className="size-3" aria-hidden="true" /><NewTab /></a></li>
            <li><Link className="hover:text-white hover:underline" to="/accessibility">Accessibility</Link></li>
            <li><a className="inline-flex items-center gap-1 hover:text-white hover:underline" href={REPO_ISSUES} target="_blank" rel="noopener noreferrer">Report a correction<ExternalLink className="size-3" aria-hidden="true" /><NewTab /></a></li>
          </ul>
        </Container>
      </div>
      <header className="on-dark sticky top-0 z-40 bg-primary-800 shadow-[0_1px_0_rgb(255_255_255/0.08),0_4px_12px_-6px_rgb(0_20_47/0.5)]">
        <Container className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 rounded-md text-white" aria-label="BetterAngeles home">
            <span className="grid size-9 place-items-center rounded-lg bg-primary-500 ring-1 ring-white/20"><Landmark className="size-5" aria-hidden="true" /></span>
            <span className="leading-tight"><span className="block text-[17px] font-bold">BetterAngeles</span><span className="hidden text-xs text-primary-200 sm:block lg:hidden xl:block">Community guide to Angeles City</span></span>
          </Link>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center">{NAV.map((n) => { const on = isActive(pathname, n); return <li key={n.to}><Link to={n.to} aria-current={on ? 'page' : undefined} className={desktopItem(on)}>{n.label}</Link></li> })}</ul>
          </nav>
          <div className="flex items-center gap-1">
            <Link to="/services" state={{ focusSearch: true }} className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-white hover:bg-white/10" aria-label="Search service guides">
              <Search className="size-5" aria-hidden="true" /><span className="hidden sm:inline lg:hidden 2xl:inline">Search</span>
            </Link>
            <button ref={menuBtn} type="button" className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-semibold text-white hover:bg-white/10 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}{open ? 'Close' : 'Menu'}
            </button>
          </div>
        </Container>
        {open && (
          <>
            <div className="absolute inset-x-0 top-full z-0 h-[100dvh] animate-enter bg-primary-900/50 lg:hidden" aria-hidden="true" onClick={() => setOpen(false)} />
            <div ref={panel} id="mobile-nav" className="absolute inset-x-0 top-full z-10 max-h-[calc(100dvh-6.25rem)] animate-enter overflow-y-auto border-t border-white/15 bg-primary-800 lg:hidden"
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node) && e.relatedTarget !== menuBtn.current && e.relatedTarget) setOpen(false) }}>
              <nav aria-label="Primary mobile"><Container className="py-3">
                <ul className="divide-y divide-white/10">
                  {NAV.map((n) => {
                    const on = isActive(pathname, n)
                    return (
                      <li key={n.to} className="py-1">
                        <Link to={n.to} aria-current={on && !n.children ? 'page' : undefined} className={cx('flex min-h-12 items-center rounded-md px-3 text-base font-semibold', on ? 'bg-white/10 text-white' : 'text-primary-50 hover:bg-white/10')}>{n.label}</Link>
                        {n.children && <ul className="mb-1 ml-3 border-l border-white/15 pl-2">{n.children.filter(([to]) => to !== n.to).map(([to, l]) => {
                          const c = under(pathname, to)
                          return <li key={to}><Link to={to} aria-current={c ? 'page' : undefined} className={cx('flex min-h-11 items-center rounded-md px-3 text-[15px]', c ? 'font-semibold text-white underline underline-offset-4' : 'text-primary-100 hover:bg-white/10')}>{l}</Link></li>
                        })}</ul>}
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-3 border-t border-white/10 px-3 pt-3 text-sm text-primary-200"><a className="inline-flex min-h-11 items-center gap-1 underline" href={LINKS.city} target="_blank" rel="noopener noreferrer">Official city website<ExternalLink className="size-3.5" aria-hidden="true" /><NewTab /></a></p>
              </Container></nav>
            </div>
          </>
        )}
      </header>
      <main id="main" tabIndex={-1} className="flex-1 outline-none">{children}</main>
      <footer className="on-dark mt-16 bg-primary-900 text-primary-100">
        <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="flex items-center gap-2 text-lg font-bold text-white"><span className="grid size-8 place-items-center rounded-lg bg-primary-500"><Landmark className="size-4" aria-hidden="true" /></span>BetterAngeles</p>
            <p className="mt-3 text-sm leading-relaxed">A community-built guide to services, offices and public records in Angeles City, Pampanga. Not affiliated with the city government. Applications, payments and appointments happen on official systems.</p>
            <p className="mt-3 text-sm">Language: English. Other languages need reviewed copy.</p>
          </div>
          <FooterCol title="Services" items={[...categories.slice(0, 5).map((c): [string, string] => [`/services/${c.slug}`, c.name]), ['/services', 'All service guides']]} />
          <FooterCol title="Government" items={[['/government', 'Government overview'], ['/directory', 'City Directory'], ['/government/barangays', 'Barangays'], ['/transparency', 'Transparency']]} />
          <FooterCol title="Explore" items={[['/about', 'About Angeles'], ['/culture', 'Culture & Events'], ['/map', 'Interactive Map']]} />
          <FooterCol title="Help" items={[['/contact', 'Contact & Help'], ['/accessibility', 'Accessibility']]} ext={[[REPO_ISSUES, 'Report a correction'], [REPO, 'Source code'], [LINKS.pagasa, 'PAGASA weather']]} />
        </Container>
        <div className="border-t border-white/10">
          <Container className="flex flex-col gap-2 py-5 text-xs text-primary-200 sm:flex-row sm:items-center sm:justify-between">
            <p>Illustrative content is labelled. Always confirm requirements with the responsible office.</p>
            <p>Open content, CC0 1.0 · <a className="underline hover:text-white" href={REPO} target="_blank" rel="noopener noreferrer">GitHub<NewTab /></a></p>
          </Container>
        </div>
      </footer>
    </div>
  )
}
function FooterCol({ title, items, ext = [] }: { title: string; items: [string, string][]; ext?: [string, string][] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">{title}</h2>
      <ul className="mt-3 space-y-0.5 text-sm">
        {items.map(([to, l]) => <li key={to}><Link className="inline-flex min-h-9 items-center underline-offset-4 hover:text-white hover:underline" to={to}>{l}</Link></li>)}
        {ext.map(([h, l]) => <li key={h}><a className="inline-flex min-h-9 items-center gap-1 underline-offset-4 hover:text-white hover:underline" href={h} target="_blank" rel="noopener noreferrer">{l}<ExternalLink className="size-3" aria-hidden="true" /><NewTab /></a></li>)}
      </ul>
    </div>
  )
}
