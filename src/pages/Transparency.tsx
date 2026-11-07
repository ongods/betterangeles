import { useSearchParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SourceLinks from '../components/ui/SourceLinks';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import { publicRecords } from '../data/transparency';
import { normalizeSearch } from '../data/serviceCatalog';

export default function Transparency() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const kind = params.get('kind') ?? '';
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  const records = publicRecords.filter(
    item =>
      (!kind || item.kind === kind) &&
      words.every(word =>
        normalizeSearch(
          `${item.title} ${item.summary} ${item.referenceDate}`
        ).includes(word)
      )
  );
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  return (
    <>
      <SEO
        title="Transparency"
        description="Available Angeles City charter documents, reported financial figures, procurement notices, and project records."
      />
      <main id="main-content" className="flex-grow">
        <Section>
          <Breadcrumbs className="mb-6" />
          <Heading>Transparency and public records</Heading>
          <Text className="max-w-3xl text-gray-800 mb-5">
            Browse the documents and dated records currently available. This is
            a partial collection, with evidence limits shown on each record.
          </Text>
          <p className="max-w-3xl text-gray-800 mb-8">
            Approved annual budgets, complete financial statements, audit
            reports, and verified current project progress are still missing. No
            totals or progress percentages are estimated.
          </p>
          <div className="search-panel grid gap-5 md:grid-cols-2 mb-7">
            <div>
              <label htmlFor="record-query">Search records</label>
              <input
                id="record-query"
                type="search"
                value={query}
                onChange={event => update('q', event.target.value)}
                placeholder="Project, year, or document name"
              />
            </div>
            <div>
              <label htmlFor="record-kind">Record type</label>
              <select
                id="record-kind"
                value={kind}
                onChange={event => update('kind', event.target.value)}
              >
                <option value="">All types</option>
                {['Document', 'Revenue', 'Procurement', 'Project'].map(
                  value => (
                    <option key={value}>{value}</option>
                  )
                )}
              </select>
            </div>
          </div>
          <div className="flex gap-5 mb-4">
            <p role="status" aria-live="polite">
              {records.length} {records.length === 1 ? 'record' : 'records'}{' '}
              found
            </p>
            {(query || kind) && (
              <button className="text-link" onClick={() => setParams({})}>
                Clear filters
              </button>
            )}
          </div>
          {records.length === 0 && (
            <Text>
              No matching records. Try a different search or clear the filters.
            </Text>
          )}
          <div className="divide-y divide-gray-200">
            {records.map(item => (
              <article key={item.id} className="py-6 max-w-4xl">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {item.kind} · {item.evidence}
                </p>
                <Heading level={2} className="text-xl md:text-2xl lg:text-2xl">
                  {item.title}
                </Heading>
                <p className="text-sm text-gray-700 mb-3">
                  {item.referenceDate}
                </p>
                <Text className="text-gray-800">{item.summary}</Text>
                {item.amount !== null && (
                  <p className="mt-4">
                    <strong>
                      {new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: item.currency,
                      }).format(item.amount)}
                    </strong>
                    <br />
                    <span className="text-sm text-gray-800">
                      {item.amountType}
                    </span>
                  </p>
                )}
                {item.downloadUrl && (
                  <p className="mt-4">
                    <a href={item.downloadUrl}>Read the saved PDF</a>
                  </p>
                )}
                <SourceLinks ids={item.sourceIds} />
              </article>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}
