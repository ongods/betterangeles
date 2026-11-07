import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SourceLinks from '../components/ui/SourceLinks';
import SEO from '../components/SEO';
import { cityData, formatNumber } from '../data/cityData';

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
            <Link to="/directory?type=Barangay">Explore the 33 barangays</Link>
          </p>
          <Heading level={2} className="mt-12">
            Heritage places
          </Heading>
          <Text className="max-w-3xl text-gray-800 mb-4">
            These selected records introduce local history. Visitor hours, fees,
            and accessibility have not been confirmed; check with the venue
            before visiting.
          </Text>
          <div className="divide-y divide-gray-200">
            {cityData.heritage.map(place => (
              <article key={place.id} className="py-5 max-w-3xl">
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
        </Section>
      </main>
    </>
  );
}
