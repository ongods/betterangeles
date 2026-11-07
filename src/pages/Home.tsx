import { Link } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import { cityData, formatNumber } from '../data/cityData';

const quickLinks = [
  ['Start or renew a business', '/services/business'],
  ['Request civil documents', '/services/civil-documents'],
  [
    'Apply for a health ID',
    '/services/health-services/apply-for-worker-health-certificate-cards',
  ],
  ['Pay local taxes and fees', '/services/taxes-fees'],
  ['Find a barangay or school', '/directory'],
  [
    'Check City Hall schedule advice',
    '/government/departments/office-schedules',
  ],
];
export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="A community guide to Angeles City services, offices, public records, and local heritage."
      />
      <main id="main-content" className="flex-grow">
        <Hero />
        <Section>
          <Heading level={2}>Start here</Heading>
          <div className="grid md:grid-cols-2 gap-x-12">
            {quickLinks.map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="flex items-center justify-between border-b border-gray-200 py-5 font-semibold text-lg"
              >
                {label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </Section>
        <Section className="bg-primary-50">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <Heading level={2}>Get to know Angeles</Heading>
              <Text className="text-gray-800 mb-5">
                Explore the city's barangays, heritage places, and available
                public directories.
              </Text>
              <Link to="/about">About Angeles</Link>
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
            </div>
          </div>
        </Section>
        <Section>
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
