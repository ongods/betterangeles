import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import { getEventStatus, getPhilippineDate } from '../data/culture';
import { formatDate } from '../data/cityData';
import { useCityFeeds, type FeedState } from '../hooks/useCityFeeds';
import { eventsPageUrl, newsPageUrl, officialCityUrl } from '../lib/cityFeed';

function FeedStatus({
  state,
  label,
  sourceUrl,
}: {
  state: FeedState<unknown>;
  label: string;
  sourceUrl: string;
}) {
  return (
    <div className="my-4 max-w-3xl">
      {state.loading && (
        <p role="status">
          {state.items === null
            ? `Loading ${label} from the city website…`
            : `Refreshing ${label}…`}
        </p>
      )}
      {state.error && (
        <p role="alert" className="text-gray-900">
          We couldn’t check the latest {label}.{' '}
          {state.items !== null &&
            'The entries below are from the last successful update. '}
          Use Refresh to try again, or{' '}
          <a href={sourceUrl}>check the official city website</a>.
        </p>
      )}
      {state.updatedAt && (
        <p className="text-sm text-gray-700 mt-2">
          {state.error ? 'Last successful update' : 'Last checked'}:{' '}
          <time dateTime={state.updatedAt.toISOString()}>
            {new Intl.DateTimeFormat('en-PH', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'Asia/Manila',
            }).format(state.updatedAt)}
          </time>{' '}
          · Philippine time
        </p>
      )}
      {state.omittedCount > 0 && (
        <p className="text-sm text-gray-700 mt-2">
          Some source entries could not be displayed. Check the official site
          for the complete listing.
        </p>
      )}
    </div>
  );
}

export default function Culture() {
  const { events, news, refresh } = useCityFeeds();
  const refreshing = events.loading || news.loading;
  const upcoming = events.items?.filter(
    event => event.end >= getPhilippineDate()
  );
  return (
    <>
      <SEO
        title="Culture and events"
        description="Upcoming events and latest updates loaded from the official Angeles City website."
      />
      <main id="main-content" className="flex-grow">
        <Section>
          <Breadcrumbs className="mb-6" />
          <Heading>Culture and events</Heading>
          <Text className="max-w-3xl text-gray-800 mb-4">
            Upcoming events and the latest city updates from the{' '}
            <a href={officialCityUrl}>official Angeles City website</a>. For
            local history and places to visit, explore{' '}
            <Link to="/about">Angeles heritage</Link>.
          </Text>
          <div className="flex flex-wrap items-center gap-4 my-6">
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="action-button inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <p className="text-sm text-gray-700">
              Updates on page visit, every five minutes while visible, and when
              you return to this page.
            </p>
          </div>
          <Heading level={2} className="mt-10">
            Upcoming events
          </Heading>
          <FeedStatus state={events} label="events" sourceUrl={eventsPageUrl} />
          {upcoming?.length === 0 && !events.error && (
            <Text className="text-gray-800">
              {events.omittedCount
                ? 'No readable upcoming event entries are available.'
                : 'No upcoming events are currently listed in the official city calendar.'}
            </Text>
          )}
          <div className="divide-y divide-gray-200">
            {upcoming?.map(event => (
              <article key={event.id} className="py-5 max-w-3xl break-words">
                <p className="text-sm text-gray-700 mb-2">
                  {getEventStatus(event.start, event.end)}
                </p>
                <Heading level={3} className="text-xl md:text-2xl lg:text-2xl">
                  <a href={event.url}>{event.title}</a>
                </Heading>
                <p>
                  <time dateTime={event.start}>{formatDate(event.start)}</time>
                  {event.end !== event.start && (
                    <>
                      {' '}
                      –{' '}
                      <time dateTime={event.end}>{formatDate(event.end)}</time>
                    </>
                  )}
                </p>
                <p className="mt-2 text-gray-800">
                  {event.allDay
                    ? 'All day'
                    : event.startTime
                      ? `Starts at ${event.startTime}${event.timezone ? ` (${event.timezone}, as published)` : ' · time zone not provided'}`
                      : 'Time not provided in the city listing'}
                </p>
                <p className="mt-2 text-gray-800">
                  {event.venue ?? 'Venue not provided in the city listing'}
                </p>
                <p className="mt-3">
                  <a href={event.url}>View official event details</a>
                </p>
              </article>
            ))}
          </div>
          <p className="mt-5">
            <a href={eventsPageUrl}>View the full city calendar</a>
          </p>
          <Heading level={2} className="mt-12">
            Latest city updates
          </Heading>
          <FeedStatus state={news} label="news" sourceUrl={newsPageUrl} />
          {news.items?.length === 0 && !news.error && (
            <Text>
              No news entries are currently available from the official site.
            </Text>
          )}
          <div className="divide-y divide-gray-200">
            {news.items?.map(item => (
              <article key={item.id} className="py-5 max-w-3xl break-words">
                <p className="text-sm text-gray-700 mb-2">
                  Published{' '}
                  <time dateTime={item.publishedOn}>
                    {formatDate(item.publishedOn)}
                  </time>
                </p>
                <Heading level={3} className="text-xl md:text-2xl lg:text-2xl">
                  <a href={item.url}>{item.title}</a>
                </Heading>
                <a href={item.url}>Read on the official city website</a>
              </article>
            ))}
          </div>
          <p className="mt-5">
            <a href={newsPageUrl}>More city news and announcements</a>
          </p>
        </Section>
      </main>
    </>
  );
}
