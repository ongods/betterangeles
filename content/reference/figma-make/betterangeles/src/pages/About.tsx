import { useState } from 'react'
import { Check, Compass, History, Landmark, RotateCcw, Sparkles, Trophy, Users, X } from 'lucide-react'
import { Button, Container, ExtLink, Facts, LinkButton, List, ListRow, Notice, OnThisPage, PageHeader, Section, SourceLabel, TextLink, Unknown, cx } from '../ui'
import { LINKS, POPULATION, barangays, heritage, quiz } from '../data'

const stats: [string, string, string][] = [
  [POPULATION.value, 'Population', '2020 Census of Population and Housing'],
  [String(barangays.length), 'Barangays', 'PSA PSGC listing'],
  ['Pampanga', 'Province', 'PSA PSGC listing'],
  ['Central Luzon', 'Region', 'PSA PSGC listing'],
]

export default function About() {
  const [ans, setAns] = useState<Record<number, number>>({})
  const answered = Object.keys(ans).length, correct = quiz.filter((x, i) => ans[i] === x.a).length
  return (
    <>
      <PageHeader eyebrow="Pampanga · Central Luzon" title="About Angeles" crumbs={[{ label: 'About Angeles' }]}
        summary="A sourced profile of Angeles City. Figures come from the Philippine Statistics Authority; sections without a dated source say so." />
      <Container className="py-6">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="City at a glance">
          {stats.map(([v, l, src]) => <li key={l} className="rounded-card border border-line bg-white p-4 sm:p-5">
            <p className="text-sm font-medium text-muted">{l}</p><p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-primary-900 sm:text-3xl">{v}</p><p className="mt-2 text-xs text-muted">{src}</p></li>)}
        </ul>
        <div className="mt-3"><SourceLabel label="PSA" href={LINKS.psa} date="Census year 2020" /></div>
        <div className="mt-6"><OnThisPage variant="inline" items={[['location', 'Location'], ['people', 'People'], ['admin', 'Administration'], ['history', 'History'], ['identity', 'Heritage and identity'], ['quiz', 'Quiz'], ['sources', 'Sources']]} /></div>

        <div className="grid gap-x-12 lg:grid-cols-2">
          <Section title="Location" id="location" icon={Compass} tagline="Where the city sits in Central Luzon">
            <Facts items={[['Province', 'Pampanga'], ['Region', 'Central Luzon'], ['Land area', <Unknown>Not loaded until a dated source is attached</Unknown>], ['Elevation', <Unknown>Not loaded</Unknown>]]} />
            <div className="mt-4 flex flex-wrap gap-2"><LinkButton to="/map" variant="secondary" size="sm">Open the interactive map</LinkButton><LinkButton href={LINKS.osm} variant="ghost" size="sm">OpenStreetMap</LinkButton></div>
          </Section>
          <Section title="People" id="people" icon={Users} tagline="Who lives in Angeles">
            <Facts items={[['Population', <span><strong className="font-semibold">{POPULATION.value}</strong> <span className="text-muted">({POPULATION.note})</span></span>], ['Households', <Unknown>Not loaded</Unknown>], ['Population by barangay', <Unknown>Not loaded until imported from PSA</Unknown>]]} />
          </Section>
        </div>

        <Section title="Administration" id="admin" icon={Landmark} divider tagline="How the city is organized">
          <p className="prose-doc text-muted">Angeles City is divided into {barangays.length} barangays. The executive branch, the Sangguniang Panlungsod and city departments are described on the Government page.</p>
          <div className="mt-3 max-w-3xl"><List>
            <ListRow to="/government" title="Government structure">Executive, legislative, departments and documents</ListRow>
            <ListRow to="/government/barangays" title={`Barangay directory (${barangays.length})`}>Search barangays and open their records</ListRow>
          </List></div>
        </Section>

        <Section title="Brief history" id="history" icon={History} divider tagline="Pending a cited source">
          <div className="max-w-3xl"><Notice title="History text pending">A cited history is not included yet, and no historical imagery is shown. It will be added from a sourced document.</Notice></div>
        </Section>

        <Section title="Heritage and identity" id="identity" icon={Sparkles} divider tagline="Places, food and culture to explore, each awaiting citation">
          <ul className="grid gap-4 md:grid-cols-3">{heritage.map((h) => <li key={h.name} className="border-t-2 border-primary-200 pt-3"><p className="font-semibold">{h.name}</p><p className="mt-1 text-[15px] text-muted">{h.note}</p></li>)}</ul>
          <p className="mt-5 text-[15px] text-muted">Festival dates and tourism details appear only when sourced. See <TextLink to="/culture">Culture & Events</TextLink> for the official calendar.</p>
        </Section>

        <Section title="Heritage quiz" id="quiz" divider tagline="Two quick questions, each answered with its source." action={answered > 0 && <Button variant="ghost" size="sm" onClick={() => setAns({})}><RotateCcw className="size-4" aria-hidden="true" />Start over</Button>}>
          <div className="max-w-3xl space-y-8">{quiz.map((x, i) => {
            const picked = ans[i]
            return (
              <fieldset key={i}><legend className="text-[17px] font-semibold">{i + 1}. {x.q}</legend>
                <div className="mt-3 flex flex-wrap gap-2">{x.options.map((o, j) => {
                  const done = picked !== undefined, isPick = picked === j, isRight = j === x.a
                  return <button key={o} type="button" aria-pressed={isPick} disabled={done && !isPick && !isRight} onClick={() => setAns({ ...ans, [i]: j })}
                    className={cx('inline-flex min-h-11 items-center gap-2 rounded-ctl border px-4 font-semibold transition-colors disabled:opacity-50',
                      !done && 'border-primary-500 bg-white text-primary-700 hover:bg-primary-50',
                      done && isRight && 'border-success-ink bg-success-bg text-success-ink',
                      done && isPick && !isRight && 'border-danger-ink bg-danger-bg text-danger-ink',
                      done && !isPick && !isRight && 'border-line text-muted')}>
                    {done && isRight && <Check className="size-4" aria-hidden="true" />}{done && isPick && !isRight && <X className="size-4" aria-hidden="true" />}{o}
                    {done && isRight && <span className="sr-only"> (correct answer)</span>}</button>
                })}</div>
                {picked !== undefined && <p role="status" className="mt-3 animate-enter text-[15px]"><strong className={picked === x.a ? 'text-success-ink' : 'text-danger-ink'}>{picked === x.a ? 'Correct.' : `Not quite. The answer is ${x.options[x.a]}.`}</strong> {x.why} <ExtLink href={x.href}>Source</ExtLink></p>}
              </fieldset>
            )
          })}
            {answered === quiz.length && <Notice tone="success" live title={`You got ${correct} of ${quiz.length} correct`}><span className="inline-flex items-center gap-1.5"><Trophy className="size-4" aria-hidden="true" />Explore more in the barangay directory or the city profile above.</span></Notice>}
          </div>
        </Section>

        <Section title="Sources" id="sources" divider>
          <ul className="space-y-2"><li><SourceLabel label="PSA Philippine Standard Geographic Code: Angeles City barangays" href={LINKS.psa} /></li><li><SourceLabel label="PSA 2020 Census of Population and Housing" href={LINKS.psa} date="Census year 2020" /></li></ul>
        </Section>
      </Container>
    </>
  )
}
