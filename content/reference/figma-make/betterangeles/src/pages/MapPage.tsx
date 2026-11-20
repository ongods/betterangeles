import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Crosshair, Layers, List as ListIcon, LocateFixed, Map as MapIcon, MapPinOff, Navigation, X } from 'lucide-react'
import { Badge, Button, ChipGroup, Container, EmptyState, Facts, LinkButton, ListRow, Notice, PageHeader, SearchField, TextField, Unknown, cx } from '../ui'
import { dirHref, directory, mapLayers, type DirType } from '../data'

const CENTER: [number, number] = [15.145, 120.594]
const TYPES: [DirType, string][] = [['Office', 'Offices'], ['Barangay', 'Barangays'], ['Official portal', 'Portals']]

export default function MapPage() {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const user = useRef<L.CircleMarker | null>(null)
  const tiles = useRef<L.TileLayer | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') ?? '', type = sp.get('type') ?? '', sel = sp.get('select'), listOnly = sp.get('view') === 'list'
  const set = (patch: Record<string, string | null>) => { const n = new URLSearchParams(sp); Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); setSp(n, { replace: true }) }
  const [errors, setErrors] = useState(0)
  const [basemap, setBasemap] = useState(true)
  const [manual, setManual] = useState('')
  const [manualErr, setManualErr] = useState('')
  const [msg, setMsg] = useState<{ tone: 'info' | 'danger' | 'success'; text: string } | null>(null)
  const [locating, setLocating] = useState(false)
  const [layerQ, setLayerQ] = useState('')

  useEffect(() => {
    if (listOnly || !el.current) return
    const m = L.map(el.current, { center: CENTER, zoom: 13, scrollWheelZoom: false })
    const t = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' })
    if (basemap) t.addTo(m)
    t.on('tileerror', () => setErrors((n) => n + 1)); t.on('tileload', () => setErrors(0))
    map.current = m; tiles.current = t; user.current = null
    return () => { m.remove(); map.current = null }
  }, [listOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleBasemap = () => { const t = tiles.current, m = map.current; if (t && m) { if (basemap) t.remove(); else t.addTo(m) } setBasemap(!basemap) }
  const recenter = () => { map.current?.setView(CENTER, 13); setMsg({ tone: 'info', text: 'Map re-centred on Angeles City.' }) }
  const place = (lat: number, lng: number, label: string) => {
    if (!map.current) { setMsg({ tone: 'info', text: `${label}: ${lat.toFixed(4)}, ${lng.toFixed(4)}. The map is hidden in list-only mode.` }); return }
    user.current?.remove()
    user.current = L.circleMarker([lat, lng], { radius: 9, color: '#003d8d', weight: 3, fillColor: '#0066eb', fillOpacity: 0.85 }).addTo(map.current).bindTooltip(label)
    map.current.setView([lat, lng], 15)
    setMsg({ tone: 'success', text: `${label} shown at ${lat.toFixed(4)}, ${lng.toFixed(4)}. No distances or directions are calculated.` })
  }
  const submitManual = (e: React.FormEvent) => {
    e.preventDefault()
    const m = manual.trim().split(/[,\s]+/).map(Number)
    if (m.length !== 2 || m.some(isNaN) || Math.abs(m[0]) > 90 || Math.abs(m[1]) > 180) { setManualErr('Enter latitude and longitude separated by a comma, for example 15.145, 120.594.'); return }
    setManualErr(''); place(m[0], m[1], 'Entered location')
  }
  const locate = () => {
    if (!navigator.geolocation) return setMsg({ tone: 'danger', text: 'Your browser does not support location. Enter coordinates instead.' })
    setLocating(true); setMsg({ tone: 'info', text: 'Waiting for your browser’s permission…' })
    navigator.geolocation.getCurrentPosition((p) => { setLocating(false); place(p.coords.latitude, p.coords.longitude, 'Your location') }, () => { setLocating(false); setMsg({ tone: 'danger', text: 'Location was not shared. You can still enter coordinates.' }) }, { timeout: 10000 })
  }

  const byQ = directory.filter((d) => !q || (d.name + ' ' + d.type + ' ' + d.description).toLowerCase().includes(q.toLowerCase().trim()))
  const list = byQ.filter((d) => !type || d.type === type)
  const selected = directory.find((d) => d.id === sel)
  const layers = mapLayers.filter((l) => l.toLowerCase().includes(layerQ.toLowerCase().trim()))
  const lastSel = useRef<string | null>(null)
  const pendingFocus = useRef(false)
  // Keyboard flow: selecting moves focus to the detail panel; "Back to list" returns focus to the same row.
  // Runs after the URL change commits, so the target element exists.
  useEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    const t = sel ? document.getElementById('m-detail') : document.getElementById('row-' + lastSel.current) ?? listRef.current?.querySelector<HTMLElement>('button')
    t?.focus()
  }, [sel])
  const choose = (id: string | null) => { if (id) lastSel.current = id; pendingFocus.current = true; set({ select: id }) }

  const panel = (
    <div className="space-y-5">
      {selected ? (
        <section aria-labelledby="m-detail" className="animate-enter">
          <Button variant="ghost" size="sm" className="-ml-3" onClick={() => choose(null)}><X className="size-4" aria-hidden="true" />Back to list</Button>
          <div className="mt-2 rounded-card border border-line p-5">
            <Badge tone={selected.type === 'Official portal' ? 'success' : 'primary'}>{selected.type}</Badge>
            <h2 id="m-detail" tabIndex={-1} className="mt-2 text-xl font-bold text-primary-900 outline-none">{selected.name}</h2>
            <p className="mt-1 text-muted">{selected.description}</p>
            <p className="mt-3 flex items-start gap-2 rounded-ctl bg-surface px-3 py-2 text-sm"><MapPinOff className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />Not marked on the map: no validated coordinates.</p>
            <Facts stacked className="mt-3" items={[['Address', <Unknown>Not available in the source.</Unknown>], ['Telephone', <Unknown>No verified telephone on record.</Unknown>]]} />
            <div className="mt-4 flex flex-wrap gap-2"><LinkButton to={dirHref(selected)}>Open full record</LinkButton>{selected.href && <LinkButton href={selected.href} variant="secondary">Official site</LinkButton>}</div>
          </div>
        </section>
      ) : (
        <section aria-labelledby="m-list">
          <h2 id="m-list" className="sr-only">Places and records</h2>
          <form role="search" onSubmit={(e) => e.preventDefault()}><SearchField id="m-q" label="Search places and records" hideLabel placeholder="Search offices, barangays, portals" value={q} onChange={(v) => set({ q: v || null })} /></form>
          <div className="mt-3"><ChipGroup label="Show" hideLabel value={type} onChange={(v) => set({ type: v === type ? null : v || null })} options={[{ value: '', label: 'All', count: byQ.length }, ...TYPES.map(([t, l]) => ({ value: t, label: l, count: byQ.filter((d) => d.type === t).length }))]} /></div>
          <p className="mt-3 text-sm text-muted" aria-live="polite">{list.length} {list.length === 1 ? 'place' : 'places'}{q && <> for “{q}”</>} · select one for details</p>
          <div ref={listRef} className="mt-1">
            {list.length ? <ul className={cx('divide-y divide-line overflow-y-auto pr-1', listOnly ? 'max-h-none' : 'max-h-[28rem]')}>{list.map((d) => <ListRow key={d.id} title={d.name} eyebrow={<span>{d.type}</span>} id={'row-' + d.id} onClick={() => choose(d.id)} selected={sel === d.id} />)}</ul>
              : <EmptyState title="No places found" action={<><Button variant="secondary" onClick={() => set({ q: null, type: null })}>Clear search</Button></>}>Try a different name, or browse by type. This is a search with no results, not an unavailable layer.</EmptyState>}
          </div>
        </section>
      )}

      <details className="group rounded-card border border-line">
        <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 px-4 font-semibold"><span className="flex items-center gap-2"><Navigation className="size-4 text-primary-600" aria-hidden="true" />Your location</span><span className="text-sm font-normal text-muted group-open:hidden">Optional</span></summary>
        <div className="space-y-3 border-t border-line px-4 py-4">
          <Button variant="secondary" size="sm" loading={locating} onClick={locate}><LocateFixed className="size-4" aria-hidden="true" />Use my current location</Button>
          <form onSubmit={submitManual} noValidate className="space-y-2">
            <TextField id="m-manual" label="Or enter coordinates" value={manual} onChange={(v) => { setManual(v); if (manualErr) setManualErr('') }} placeholder="15.145, 120.594" inputMode="decimal" error={manualErr} helper="Street addresses are not geocoded." />
            <Button type="submit" size="sm">Show on map</Button>
          </form>
        </div>
      </details>
      {msg && <Notice tone={msg.tone} compact live>{msg.text}</Notice>}

      <details className="group rounded-card border border-line">
        <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 px-4 font-semibold"><span className="flex items-center gap-2"><Layers className="size-4 text-primary-600" aria-hidden="true" />Map key and layers</span><span className="text-sm font-normal text-muted">1 of {mapLayers.length + 1} available</span></summary>
        <fieldset className="border-t border-line px-4 py-4"><legend className="sr-only">Map layers</legend>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={basemap} onChange={toggleBasemap} disabled={listOnly} className="size-[18px] accent-primary-600" /><span className="flex-1 font-medium">OpenStreetMap basemap</span><Badge tone="success">Available</Badge></label>
          <SearchField id="m-l" label="Filter layers" hideLabel placeholder="Filter layers" value={layerQ} onChange={setLayerQ} className="my-2" />
          {layers.length ? <ul className="max-h-56 overflow-y-auto">{layers.map((l) => <li key={l}><label className="flex min-h-10 items-center gap-3 text-muted"><input type="checkbox" disabled className="size-[18px]" aria-describedby="m-l-why" /><span className="flex-1">{l}</span><Badge>No validated data</Badge></label></li>)}</ul> : <p className="py-2 text-sm text-muted">No layer is named “{layerQ}”.</p>}
          <p id="m-l-why" className="mt-2 text-sm text-muted">Unavailable layers have no validated coordinates yet. That differs from a search with no matching places.</p>
        </fieldset>
      </details>
    </div>
  )

  return (
    <>
      <PageHeader eyebrow="Explore" title="Interactive Map" crumbs={[{ label: 'Interactive Map' }]}
        summary="An OpenStreetMap basemap of Angeles City with a searchable list of offices, barangays and official portals. Facility locations are not validated, so no markers are drawn."
        actions={<Button variant="secondary" aria-pressed={listOnly} onClick={() => set({ view: listOnly ? null : 'list' })}>{listOnly ? <><MapIcon className="size-4" aria-hidden="true" />Show map</> : <><ListIcon className="size-4" aria-hidden="true" />List only</>}</Button>} />
      <Container className="py-6">
        <div className={cx('grid gap-6', !listOnly && 'lg:grid-cols-[380px_minmax(0,1fr)]')}>
          <div className={cx(!listOnly && 'order-2 lg:order-1', listOnly && 'mx-auto w-full max-w-2xl')}>{panel}</div>
          {!listOnly && (
            <div className="order-1 min-w-0 lg:order-2">
              <div className="lg:sticky lg:top-24">
                {errors > 2 && <div className="mb-3"><Notice tone="danger" live title="Map tiles could not be loaded" action={<><Button variant="secondary" size="sm" onClick={() => { setErrors(0); tiles.current?.redraw() }}>Retry tiles</Button><Button variant="secondary" size="sm" onClick={() => set({ view: 'list' })}>Use list only</Button></>}>The basemap server may be unreachable. The list still works.</Notice></div>}
                <div className="relative">
                  <div ref={el} role="region" aria-label="Map of Angeles City. The list of places is the text alternative." className="z-0 h-72 w-full overflow-hidden rounded-card border border-line bg-surface sm:h-96 lg:h-[calc(100vh-9rem)] lg:max-h-[640px]" />
                  <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex justify-end"><button type="button" onClick={recenter} className="pointer-events-auto inline-flex min-h-10 items-center gap-1.5 rounded-ctl bg-white px-3 text-sm font-semibold text-primary-800 shadow-md ring-1 ring-line hover:bg-primary-50"><Crosshair className="size-4" aria-hidden="true" />Re-centre</button></div>
                  {selected && <div className="pointer-events-none absolute inset-x-3 bottom-8 z-[500] flex justify-center"><p className="animate-enter rounded-ctl bg-primary-900/90 px-3 py-2 text-center text-sm text-white shadow-lg">{selected.name} has no validated coordinates, so it isn’t marked.</p></div>}
                  {!basemap && <div className="pointer-events-none absolute inset-0 z-[400] grid place-items-center"><p className="rounded-ctl bg-white px-3 py-2 text-sm text-muted shadow">Basemap hidden. Turn it on under Map key and layers.</p></div>}
                </div>
                <p className="mt-2 text-xs text-muted">Map data &copy; OpenStreetMap contributors. Scroll-zoom is off so the page can scroll; use the + and − controls.</p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  )
}
