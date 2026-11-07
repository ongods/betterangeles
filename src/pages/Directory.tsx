import { useSearchParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SourceLinks from '../components/ui/SourceLinks';
import SEO from '../components/SEO';
import { directoryEntries, searchDirectory } from '../data/directory';

export default function Directory() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const type = params.get('type') ?? '';
  const entries = searchDirectory(query, type);
  const types = [...new Set(directoryEntries.map(item => item.type))];
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  return (
    <>
      <SEO
        title="City directory"
        description="Search available Angeles City barangay, school, health-unit, and office records with their sources."
      />
      <main id="main-content" className="flex-grow">
        <Section>
          <Breadcrumbs className="mb-6" />
          <Heading>City directory</Heading>
          <Text className="max-w-3xl mb-7 text-gray-800">
            Find a barangay, school, health unit, or city office in the
            available records. Coverage is partial. Source years, missing
            addresses, and service limits are shown with each entry.
          </Text>
          <div className="search-panel grid gap-5 md:grid-cols-[2fr_1fr] mb-7">
            <div>
              <label htmlFor="directory-query">
                Search names, locations, or IDs
              </label>
              <input
                id="directory-query"
                type="search"
                value={query}
                onChange={event => update('q', event.target.value)}
                placeholder="Balibago, school name, or PSGC…"
              />
            </div>
            <div>
              <label htmlFor="directory-type">Record type</label>
              <select
                id="directory-type"
                value={type}
                onChange={event => update('type', event.target.value)}
              >
                <option value="">All record types</option>
                {types.map(value => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-5 mb-4">
            <p role="status" aria-live="polite">
              {entries.length} {entries.length === 1 ? 'record' : 'records'}{' '}
              found
            </p>
            {(query || type) && (
              <button
                type="button"
                onClick={() => setParams({})}
                className="text-link"
              >
                Clear filters
              </button>
            )}
          </div>
          {entries.length === 0 && (
            <Text>
              No records match. Try another name or clear the filters.
            </Text>
          )}
          <div className="divide-y divide-gray-200">
            {entries.map(item => (
              <article
                key={`${item.type}-${item.id}`}
                className="py-5 max-w-4xl"
              >
                <p className="text-sm text-gray-700 mb-1">{item.type}</p>
                <Heading
                  level={2}
                  className="text-xl md:text-xl lg:text-xl mb-2"
                >
                  {item.name}
                </Heading>
                <Text className="text-gray-800">{item.details}</Text>
                <SourceLinks ids={item.sourceIds} />
              </article>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}
