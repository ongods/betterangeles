import { Link } from 'react-router-dom';
import BrowseTopics from '../components/home/BrowseTopics';
import Hero from '../components/sections/Hero';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import { cityData, formatNumber } from '../data/cityData';
import { lazy, Suspense } from 'react';
import CityUpdates from '../components/home/CityUpdates';
import { publicRecords } from '../data/transparency';
const CityMap = lazy(() => import('../components/ui/CityMap'));

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="A community guide to Angeles City services, offices, public records, and local heritage."
      />
      <main id="main-content" className="flex-grow">
        <Hero />
        <BrowseTopics />
        <CityUpdates />
        <Section className="bg-primary-50">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <Heading level={2}>Angeles at a glance</Heading>
              <Text className="text-gray-800 mb-5">
                Explore the city's barangays, heritage places, and available
                public directories.
              </Text>
              <Link to="/about">About Angeles</Link>
              <div className="mt-7">
                <Suspense fallback={<p role="status">Loading city map…</p>}>
                  <CityMap compact />
                </Suspense>
                <Link to="/map" className="inline-block mt-3">
                  Explore the interactive map
                </Link>
              </div>
            </div>
            <div>
              <dl className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm text-gray-700">
                    Population · 2024 POPCEN
                  </dt>
                  <dd className="text-2xl font-semibold tabular-nums mt-2">
                    {formatNumber(cityData.profile.population)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-700">
                    Barangays · PSA listing
                  </dt>
                  <dd className="text-2xl font-semibold tabular-nums mt-2">
                    {cityData.profile.barangayCount}
                  </dd>
                </div>
              </dl>
              <p className="text-sm text-gray-700 mt-5">
                Source:{' '}
                <a href={cityData.sources['doc20261028:S01'].url}>
                  Philippine Statistics Authority
                </a>
                . Barangay listing dated {cityData.profile.barangayEdition}.
              </p>
              <div className="border-t border-primary-200 mt-7 pt-6">
                <Heading level={3} className="text-xl md:text-xl lg:text-xl">
                  Current weather
                </Heading>
                <p>
                  Current conditions are not connected. Climate averages are not
                  today’s readings.
                </p>
                <p className="mt-3">
                  <a href="https://www.pagasa.dost.gov.ph/">
                    Check PAGASA weather and advisories
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <section>
              <Heading level={2}>A city with stories to tell</Heading>
              <p className="text-gray-800 mb-5">
                From the old city hall at Museo ning Angeles to the Museum of
                Philippine Social History at Pamintuan Mansion, explore places
                that hold the city’s history.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link to="/about#heritage">Explore heritage places</Link>
                <Link to="/about#heritage-quiz">
                  Try the Angeles heritage quiz
                </Link>
              </div>
            </section>
            <section>
              <Heading level={2}>Documented city projects</Heading>
              <p className="text-sm text-gray-700 mb-4">
                Dated reports; current construction progress is unverified.
              </p>
              {publicRecords
                .filter(item => item.kind === 'Project')
                .map(item => (
                  <article
                    key={item.id}
                    className="py-3 border-b border-gray-200"
                  >
                    <Link
                      to={`/transparency/${item.id}`}
                      className="font-semibold"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-700 mt-2">
                      {item.referenceDate}
                    </p>
                  </article>
                ))}
            </section>
          </div>
          <Heading level={2}>City information</Heading>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Heading level={3}>Government</Heading>
              <Text className="mb-3 text-gray-800">
                Executive and council records, with source dates and office
                schedule advice.
              </Text>
              <Link to="/government/departments">
                Explore government information
              </Link>
            </div>
            <div>
              <Heading level={3}>Public records</Heading>
              <Text className="mb-3 text-gray-800">
                Available charter documents, reported financial figures, and
                project records.
              </Text>
              <Link to="/transparency">Browse transparency records</Link>
            </div>
            <div>
              <Heading level={3}>Culture and heritage</Heading>
              <Text className="mb-3 text-gray-800">
                Discover local heritage and see current events and updates from
                the official city website.
              </Text>
              <Link to="/culture">See events and city updates</Link>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
