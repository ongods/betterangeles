import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, LinkButton, SearchField } from '../ui'

export default function NotFound() {
  const [q, setQ] = useState('')
  const go = useNavigate()
  useEffect(() => { document.title = 'Page not found · BetterAngeles' }, [])
  return (
    <Container className="py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="font-semibold text-primary-600">Error 404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">We couldn’t find that page</h1>
        <p className="mt-3 text-lg text-muted">The link may be old or mistyped. Search the service guides, or start from one of these pages.</p>
        <form role="search" className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); go(`/services${q.trim() ? '?q=' + encodeURIComponent(q.trim()) : ''}`) }}>
          <SearchField id="nf-q" label="Search service guides" hideLabel value={q} onChange={setQ} placeholder="Search service guides" className="flex-1" />
          <Button type="submit">Search</Button>
        </form>
        <div className="mt-6 flex flex-wrap gap-2"><LinkButton to="/" variant="secondary">Home</LinkButton><LinkButton to="/directory" variant="secondary">City Directory</LinkButton><LinkButton to="/contact" variant="ghost">Contact & Help</LinkButton></div>
      </div>
    </Container>
  )
}
