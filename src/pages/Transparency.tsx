import { Link, useSearchParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SourceLinks from '../components/ui/SourceLinks';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import {
  publicRecords,
  recordContexts,
  searchPublicRecords,
  formatRecordAmount,
} from '../data/transparency';

export default function Transparency() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const kind = params.get('kind') ?? '';
  const year = params.get('year') ?? '';
  const records = searchPublicRecords(query, kind, year);
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
        description="Dated Angeles City financial records, procurement notices, project records, and documents with sources."
      />
      <main id="main-content">
        <Section>
          <Breadcrumbs className="mb-6" />
          <Heading>Follow the public record</Heading>
          <p className="max-w-3xl text-lg text-gray-800 mb-7">
            Explore the available documents, financial reports, and project
            records for Angeles City. Every figure keeps its period, meaning,
            and source.
          </p>
          <div className="notice mb-8">
            <Heading level={2} className="text-xl md:text-xl lg:text-xl">
              Annual budget and audit documents are pending
            </Heading>
            <p className="max-w-3xl">
              A complete approved annual budget, financial statements, and audit
              report have not been verified. The records below cannot establish
              total spending or current project completion.
            </p>
          </div>
          <div className="search-panel grid md:grid-cols-[2fr_1fr_1fr] gap-5 mb-7">
            <div>
              <label htmlFor="record-query">Search public records</label>
              <input
                id="record-query"
                type="search"
                value={query}
                onChange={event => update('q', event.target.value)}
                placeholder="Project, notice, or document"
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
                {[
                  'Budget',
                  'Revenue',
                  'Procurement',
                  'Project',
                  'Document',
                  'Audit',
                ].map(value => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="record-year">Reference year</label>
              <select
                id="record-year"
                value={year}
                onChange={event => update('year', event.target.value)}
              >
                <option value="">All years</option>
                {[
                  ...new Set(
                    publicRecords.map(item => recordContexts[item.id].year)
                  ),
                ]
                  .sort()
                  .reverse()
                  .map(value => (
                    <option key={value}>{value}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex gap-5 mb-5">
            <p role="status" aria-live="polite">
              {records.length} {records.length === 1 ? 'record' : 'records'}{' '}
              found
            </p>
            {(query || kind || year) && (
              <button className="text-link" onClick={() => setParams({})}>
                Clear filters
              </button>
            )}
          </div>
          {!records.length && (
            <div className="py-8">
              <Heading level={2}>No records match</Heading>
              <p>
                Try a different search or clear the filters. Approved budget and
                audit documents are still awaiting verification.
              </p>
            </div>
          )}
          {records.length > 0 && (
            <div
              className="table-scroll"
              role="region"
              aria-label="Public record table"
              tabIndex={0}
            >
              <table className="records-table">
                <caption>
                  Available records. Amounts describe different financial
                  measures and must not be added together.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Record</th>
                    <th scope="col">Period / date</th>
                    <th scope="col">Amount and type</th>
                    <th scope="col">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(item => (
                    <tr key={item.id}>
                      <th scope="row">
                        <span className="block text-sm text-gray-700 font-normal mb-2">
                          {item.kind}
                        </span>
                        <Link to={`/transparency/${item.id}`}>
                          {item.title}
                        </Link>
                      </th>
                      <td>{item.referenceDate}</td>
                      <td>
                        <span className="block font-semibold tabular-nums mb-2">
                          {formatRecordAmount(item)}
                        </span>
                        <span className="text-sm">
                          {item.amountType ?? 'Document; no monetary figure'}
                        </span>
                      </td>
                      <td>
                        {item.evidence}
                        <SourceLinks ids={item.sourceIds} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-10 mt-12">
            <section>
              <Heading level={2} className="text-2xl md:text-2xl lg:text-2xl">
                Understanding the amounts
              </Heading>
              <p>
                Revenue is money reported as collected. An approved budget for a
                contract (ABC) is a procurement ceiling. A reported project cost
                is not proof of a contract payment, disbursement, or audited
                final cost.
              </p>
            </section>
            <section>
              <Heading level={2} className="text-2xl md:text-2xl lg:text-2xl">
                Project monitoring
              </Heading>
              <p>
                Open a project record for its published location, agency,
                amount, and missing fields. Progress percentages will appear
                only when a dated monitoring source is available.
              </p>
              <Link to="/map?layer=projects" className="inline-block mt-4">
                Explore project locations
              </Link>
            </section>
          </div>
        </Section>
      </main>
    </>
  );
}
