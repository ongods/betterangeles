import { useState } from 'react'
import { CalendarDays, Newspaper } from 'lucide-react'
import { ChipGroup, Container, ExtLink, Notice, PageHeader, Section } from '../ui'
import { EventList, FeedStatus, NewsList, eventFilters, type EventFilter } from '../components/Feeds'
import { LINKS } from '../data'
import { useFeed, type EventItem, type NewsItem } from '../feeds'

export default function Culture() {
  const ev = useFeed<EventItem>('events'), nw = useFeed<NewsItem>('news')
  const [filter, setFilter] = useState<EventFilter>('all')
  return (
    <>
      <PageHeader eyebrow="Explore" title="Culture & Events" crumbs={[{ label: 'About Angeles', to: '/about' }, { label: 'Culture & Events' }]}
        summary="Official calendar events and city news, each with its date and source. Each feed loads and refreshes independently." />
      <Container className="py-6">
        <Notice tone="warning" title="Illustrative feed entries">Items below are samples that demonstrate feed states. They are not real announcements. News is not an emergency alert; see <ExtLink href={LINKS.pagasa}>PAGASA</ExtLink> for weather advisories.</Notice>
        <div className="grid gap-x-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <Section title="Events calendar" id="ev" icon={CalendarDays} tagline="Sorted by date. Changed events stay listed with their status.">
            <FeedStatus f={ev} name="events" />
            {ev.fetchedAt && <div className="mb-4"><ChipGroup label="Show events" hideLabel value={filter} onChange={setFilter} options={eventFilters.map(([k, l, t]) => ({ value: k, label: l, count: ev.data.filter(t).length }))} /></div>}
            <EventList f={ev} filter={filter} onReset={() => setFilter('all')} />
          </Section>
          <Section title="City news" id="nw" icon={Newspaper} tagline="Latest posts from the official city website feed.">
            <FeedStatus f={nw} name="news" />
            <NewsList f={nw} />
          </Section>
        </div>
      </Container>
    </>
  )
}
