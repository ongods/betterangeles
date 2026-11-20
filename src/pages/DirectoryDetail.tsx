import { Link, useParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SourceLinks from '../components/ui/SourceLinks';
import SEO from '../components/SEO';
import { directoryEntries, directoryHref } from '../data/directory';
import { cityData, formatNumber } from '../data/cityData';
import officials from '../data/barangayOfficials.json';
import { contactText } from '../lib/contacts';
import NotFound from './NotFound';

export default function DirectoryDetail({
  barangay = false,
}: {
  barangay?: boolean;
}) {
  const { id, type } = useParams();
  const entry = directoryEntries.find(
    item =>
      item.id === id &&
      (barangay
        ? item.type === 'Barangay'
        : directoryHref(item) === `/directory/${type}/${id}`)
  );
  if (!entry) return <NotFound />;
  const record = barangay
    ? cityData.barangays.find(item => item.id === id)
    : undefined;
  const official = barangay
    ? officials.find(item => item.barangayId === id)
    : undefined;
  return (
    <>
      <SEO title={entry.name} description={entry.details} />
      <main id="main-content">
        <Section>
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: 'Home', href: '/' },
              {
                label: barangay ? 'Government' : 'City directory',
                href: barangay ? '/government' : '/directory',
              },
              ...(barangay
                ? [{ label: 'Barangays', href: '/government/barangays' }]
                : []),
              { label: entry.name },
            ]}
          />
          <Heading>{entry.name}</Heading>
          <p className="max-w-3xl text-gray-800">{entry.details}</p>
          {record && (
            <dl className="facts-grid my-8">
              <div>
                <dt>PSGC identifier</dt>
                <dd className="tabular-nums">{record.id}</dd>
              </div>
              <div>
                <dt>2024 census population</dt>
                <dd className="tabular-nums">
                  {formatNumber(record.population)} people
                </dd>
              </div>
              <div>
                <dt>Barangay list edition</dt>
                <dd>31 July 2025</dd>
              </div>
              <div>
                <dt>Hall address and coordinates</dt>
                <dd>Not verified</dd>
              </div>
            </dl>
          )}
          <SourceLinks ids={entry.sourceIds} />
          <p className="mt-3 text-sm text-gray-700">
            Source extraction: 28 October 2026. Source-specific school years and
            older records retain their stated dates.
          </p>
          {official && (
            <section className="mt-10 max-w-3xl">
              <Heading level={2}>Published barangay official record</Heading>
              <p className="notice mb-5">
                This is a dated directory transcription. The original workbook’s
                issuer and publication date are unconfirmed. Current
                appointments, number ownership, and working telephone lines have
                not been independently checked.
              </p>
              <dl className="facts-grid">
                <div>
                  <dt>Role</dt>
                  <dd>{official.role}</dd>
                </div>
                <div>
                  <dt>Name as published</dt>
                  <dd>{official.name}</dd>
                </div>
                <div>
                  <dt>Term as published</dt>
                  <dd>{official.term}</dd>
                </div>
                <div>
                  <dt>Directory telephone on captain row</dt>
                  <dd>{contactText(official.rawContact)}</dd>
                </div>
              </dl>
              <p className="text-sm text-gray-700 mt-4">
                The column is “BARANGAY TEL NO”; it does not establish a
                personal or direct captain number. Original value:{' '}
                {official.rawContact}. Worksheet: Sheet1, row{' '}
                {official.sourceRow}.
              </p>
              <p className="mt-4">
                <a href="https://docs.google.com/document/d/12tTdNNL5tomBFAQpSoRla_LjOb9UhHoAcyCg9y-Vf00/edit?tab=t.c9b8ncio4f4">
                  Source transcription (S56), collected 28 October 2026
                </a>
              </p>
              <p className="mt-3 text-sm text-gray-700">
                The linked{' '}
                <a
                  href={`https://docs.google.com/spreadsheets/d/1AA9nh2UkN5MKepza8cnmH9YuoGOEos9w5Q9zMezwsZk/edit#gid=1688846622&range=A${official.sourceRow}:L${official.sourceRow}`}
                >
                  officials worksheet row
                </a>{' '}
                was compared with this transcription on 19 November 2026. This
                confirms the transcription, not the current appointment or
                telephone service.
              </p>
            </section>
          )}
          <div className="mt-10 flex flex-wrap gap-6">
            <Link to={barangay ? '/government/barangays' : '/directory'}>
              Back to directory
            </Link>
            <Link to={`/map?q=${encodeURIComponent(entry.name)}`}>
              Check map availability
            </Link>
            <Link to="/contact">Help with official contacts</Link>
          </div>
        </Section>
      </main>
    </>
  );
}
