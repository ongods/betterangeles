import { Link, useParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SourceLinks from '../components/ui/SourceLinks';
import SEO from '../components/SEO';
import {
  publicRecords,
  recordContexts,
  formatRecordAmount,
  procurementDeadline,
} from '../data/transparency';
import NotFound from './NotFound';

export default function RecordDetail() {
  const { id } = useParams();
  const record = publicRecords.find(item => item.id === id);
  if (!record) return <NotFound />;
  const context = recordContexts[record.id];
  return (
    <>
      <SEO title={record.title} description={record.summary} />
      <main id="main-content">
        <Section>
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Transparency', href: '/transparency' },
              { label: record.title },
            ]}
          />
          <Heading className="max-w-4xl">{record.title}</Heading>
          <p className="text-gray-700 mb-6">
            {record.kind} · {record.evidence} · {record.referenceDate}
          </p>
          <p className="max-w-3xl text-lg">{record.summary}</p>
          <dl className="facts-grid my-8">
            <div>
              <dt>Amount</dt>
              <dd className="text-2xl font-semibold tabular-nums">
                {formatRecordAmount(record)}
              </dd>
            </div>
            <div>
              <dt>Amount type</dt>
              <dd>{record.amountType ?? 'Not applicable to this document'}</dd>
            </div>
            <div>
              <dt>Reference period</dt>
              <dd>{record.referenceDate}</dd>
            </div>
            <div>
              <dt>Source collection</dt>
              <dd>October 2026; see the individual source</dd>
            </div>
          </dl>
          {record.kind === 'Procurement' && (
            <section className="notice mb-8">
              <Heading level={2} className="text-xl md:text-xl lg:text-xl">
                Notice status
              </Heading>
              <p>
                Source-reported status: {context.sourceStatus ?? 'Not provided'}
                .
              </p>
              <p className="mt-2">
                {procurementDeadline(context)}. This does not establish an
                award, contract, expenditure, or construction progress.
              </p>
            </section>
          )}
          {record.kind === 'Project' && (
            <section className="my-10">
              <Heading level={2}>Project information</Heading>
              <dl className="facts-grid">
                {[
                  ['Published location', context.location],
                  ['Implementing agency', context.agency],
                  ['Funding', context.funding],
                  ['Contractor', context.contractor],
                  ['Start date', context.startDate],
                  ['End date', context.endDate],
                  [
                    'Physical progress',
                    record.progress === null ? null : `${record.progress}%`,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value ?? 'Not confirmed in the available records'}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5">
                Procurement status and physical construction progress are
                recorded separately. An announcement or inauguration date does
                not establish a checked completion state.
              </p>
            </section>
          )}
          <Heading level={2}>Read the source</Heading>
          {record.downloadUrl && (
            <p className="mb-4">
              <a href={record.downloadUrl}>Read the saved PDF</a>
            </p>
          )}
          <SourceLinks ids={record.sourceIds} />
          <p className="mt-8">
            <Link to="/transparency">Back to transparency records</Link>
          </p>
        </Section>
      </main>
    </>
  );
}
