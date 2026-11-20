import { Link } from 'react-router-dom';
import { useCityFeeds, type FeedState } from '../../hooks/useCityFeeds';
import { canFeatureEvent, getEventStatus } from '../../data/culture';
import { formatDate } from '../../data/cityData';
import { eventsPageUrl, newsPageUrl } from '../../lib/cityFeed';
import { Heading } from '../ui/Heading';
import Section from '../ui/Section';

function FeedNotice({
  state,
  url,
}: {
  state: FeedState<unknown>;
  url: string;
}) {
  return (
    <div className="text-sm text-gray-700 mb-5">
      {state.loading && (
        <p role="status">Checking the official city website…</p>
      )}
      {state.error && (
        <p role="status">
          The latest listing could not be checked.{' '}
          {state.items && 'Showing the last successful update. '}
          <a href={url}>Check the official listing</a> or use Refresh.
        </p>
      )}
      {state.updatedAt && (
        <p className="mt-2">
          {state.error ? 'Last successful update' : 'Checked'}{' '}
          {new Intl.DateTimeFormat('en-PH', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Manila',
          }).format(state.updatedAt)}{' '}
          · Philippine time
        </p>
      )}
      {state.omittedCount > 0 && (
        <p>
          Some entries could not be read. Check the official listing for the
          complete calendar.
        </p>
      )}
    </div>
  );
}

export default function CityUpdates() {
  const { news, events, refresh } = useCityFeeds();
  const upcoming = events.items?.filter(event => canFeatureEvent(event));
  return (
    <Section className="bg-gray-50" id="city-updates">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <Heading level={2} className="mb-0">
          From the city
        </Heading>
        <button
          className="text-link disabled:opacity-60"
          disabled={news.loading || events.loading}
          onClick={refresh}
        >
          Refresh updates
        </button>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        <section>
          <Heading level={3} className="text-xl md:text-2xl lg:text-2xl">
            Alerts & announcements
          </Heading>
          <p className="mb-4 text-gray-800">
            No active alert has been verified for this guide. The dated news
            below is not an emergency alert feed.
          </p>
          <FeedNotice state={news} url={newsPageUrl} />
          {news.items?.length === 0 && !news.error && (
            <p>No news entries are currently available.</p>
          )}
          {news.items?.map(item => (
            <article key={item.id} className="py-4 border-t border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                Published {formatDate(item.publishedOn)}
              </p>
              <Heading level={4} className="text-lg md:text-lg lg:text-lg mb-1">
                <a href={item.url}>{item.title}</a>
              </Heading>
            </article>
          ))}
          <p className="mt-5">
            <a href={newsPageUrl}>Official news and announcements</a>
          </p>
        </section>
        <section>
          <Heading level={3} className="text-xl md:text-2xl lg:text-2xl">
            Upcoming events
          </Heading>
          <p className="mb-4 text-gray-800">
            Scheduled dates from the official calendar. Check the event page for
            changes before making plans.
          </p>
          <FeedNotice state={events} url={eventsPageUrl} />
          {upcoming?.length === 0 && !events.error && (
            <div className="py-6">
              <p>
                No upcoming events are currently listed in the official
                calendar.
              </p>
              <p className="mt-3">
                <Link to="/about#heritage">
                  Explore heritage places while you’re here
                </Link>
                .
              </p>
            </div>
          )}
          {upcoming?.slice(0, 3).map(event => (
            <article key={event.id} className="py-4 border-t border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                {formatDate(event.start)} ·{' '}
                {getEventStatus(event.start, event.end)}
                {event.sourceStatus &&
                  ` · Source status: ${event.sourceStatus}`}
              </p>
              <Heading level={4} className="text-lg md:text-lg lg:text-lg mb-1">
                <a href={event.url}>{event.title}</a>
              </Heading>
            </article>
          ))}
          <p className="mt-5">
            <Link to="/culture">All events and city updates</Link>
          </p>
        </section>
      </div>
    </Section>
  );
}
