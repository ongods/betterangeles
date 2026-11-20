import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SourceLinks from '../components/ui/SourceLinks';
import SEO from '../components/SEO';
import { cityData, formatNumber } from '../data/cityData';
import HeritageQuiz from '../components/sections/HeritageQuiz';

export default function About() {
  return (
    <>
      <SEO
        title="About Angeles"
        description="A sourced introduction to Angeles City, its population, barangays, and heritage."
      />
      <main id="main-content" className="flex-grow">
        <Section>
          <Breadcrumbs className="mb-6" />
          <Heading>About Angeles</Heading>
          <Text className="max-w-3xl text-gray-800">
            Angeles is a highly urbanized city in Central Luzon, geographically
            in Pampanga and politically independent. Explore its communities and
            local heritage through the available source records.
          </Text>
          <SourceLinks ids={['doc20261028:S51']} />
          <Heading level={2} className="mt-10">
            City profile
          </Heading>
          <dl className="grid sm:grid-cols-3 gap-6 border-y border-gray-200 py-6">
            <div>
              <dt>Population · {cityData.profile.populationYear} POPCEN</dt>
              <dd className="text-2xl font-semibold tabular-nums mt-2">
                {formatNumber(cityData.profile.population)}
              </dd>
            </div>
            <div>
              <dt>Barangays</dt>
              <dd className="text-2xl font-semibold tabular-nums mt-2">
                {cityData.profile.barangayCount}
              </dd>
            </div>
            <div>
              <dt>City PSGC</dt>
              <dd className="text-xl font-semibold tabular-nums mt-2">
                {cityData.profile.psgc}
              </dd>
            </div>
          </dl>
          <SourceLinks ids={cityData.profile.sourceIds} />
          <p className="mt-3 text-sm text-gray-700">
            Population reference year: 2024. Barangay list edition:{' '}
            {cityData.profile.barangayEdition}. These are dated source values.
          </p>
          <p className="mt-5">
            <Link to="/government/barangays">Explore the 33 barangays</Link>
          </p>
          <section className="mt-12 max-w-3xl">
            <Heading level={2}>A brief history through its buildings</Heading>
            <p>
              The city’s surviving buildings offer a window into local history.
              Holy Rosary Church was completed in 1896. The former city hall,
              built in 1922, later became Museo ning Angeles. At Pamintuan
              Mansion, the Museum of Philippine Social History opened in 2015.
            </p>
            <SourceLinks ids={['doc20261028:S34', 'doc20261028:S36']} />
            <p className="mt-3 text-sm text-gray-700">
              These are selected documented milestones, rather than a complete
              city history.
            </p>
          </section>
          <div id="heritage" className="pt-12">
            <Heading level={2}>Heritage places</Heading>
          </div>
          <Text className="max-w-3xl text-gray-800 mb-4">
            These selected records introduce local history. Visitor hours, fees,
            and accessibility have not been confirmed; check with the venue
            before visiting.
          </Text>
          <div className="divide-y divide-gray-200">
            {cityData.heritage.map(place => (
              <article key={place.id} id={place.id} className="py-5 max-w-3xl">
                <Heading level={3}>{place.name}</Heading>
                <Text>{place.summary}</Text>
                <p className="mt-2 text-gray-800">
                  Published location: {place.address}
                </p>
                <SourceLinks ids={place.sourceIds} />
              </article>
            ))}
          </div>
          <p className="mt-6">
            <Link to="/culture">See current events and city updates</Link>
          </p>
          <section className="mt-12 max-w-3xl">
            <Heading level={2}>
              Festivals, food, and Kapampangan heritage
            </Heading>
            <p>
              The city tourism office traces the Sisig Festival to 2003 and
              describes Lucia Cunanan’s role in popularizing sizzling sisig.
              Festival history is distinct from this year’s event schedule; use
              the official calendar for upcoming dates.
            </p>
            <SourceLinks ids={['doc20261028:S43']} />
            <Heading level={3} className="mt-8">
              Explore the Kapampangan language
            </Heading>
            <p>
              Holy Angel University’s Center for Kapampangan Studies provides
              cultural research and language resources. Reviewed dictionary
              entries and Kulitan teaching materials are still being gathered
              for this guide.
            </p>
            <p className="mt-3">
              <a href={cityData.sources['doc20261028:S37'].url}>
                Visit the Center for Kapampangan Studies
              </a>
            </p>
            <p className="mt-3">
              <a href={cityData.sources['doc20261028:S39'].url}>
                Explore its community-contributed translator
              </a>
            </p>
          </section>
          <HeritageQuiz />
        </Section>
      </main>
    </>
  );
}
