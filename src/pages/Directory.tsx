import { Link, useSearchParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SourceLinks from '../components/ui/SourceLinks';
import SEO from '../components/SEO';
import { cityData, formatNumber } from '../data/cityData';
import {
  directoryEntries,
  directoryHref,
  searchDirectory,
} from '../data/directory';

export default function Directory({
  barangaysOnly = false,
}: {
  barangaysOnly?: boolean;
}) {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const type = barangaysOnly ? 'Barangay' : (params.get('type') ?? '');
  const sort = params.get('sort') ?? 'name';
  const entries = searchDirectory(query, type);
  entries.sort((a, b) =>
    sort === 'code' ? a.id.localeCompare(b.id) : a.name.localeCompare(b.name)
  );
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
          <Heading>
            {barangaysOnly ? 'The 33 barangays of Angeles' : 'City directory'}
          </Heading>
          <Text className="max-w-3xl mb-7 text-gray-800">
            Find a barangay, school, health unit, or city office in the
            available records. Coverage is partial. Source years, missing
            addresses, and service limits are shown with each entry.
          </Text>
          {barangaysOnly && (
            <p className="mb-6 text-gray-800">
              PSA list dated 31 July 2025, with 2024 census counts. Open a
              barangay for its PSGC code, population, and qualified official
              record.
            </p>
          )}
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
            {!barangaysOnly && (
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
            )}
            {barangaysOnly && (
              <div>
                <label htmlFor="barangay-sort">Sort by</label>
                <select
                  id="barangay-sort"
                  value={sort}
                  onChange={event => update('sort', event.target.value)}
                >
                  <option value="name">Barangay name</option>
                  <option value="code">PSGC code</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-5 mb-4">
            <p role="status" aria-live="polite">
              {entries.length} {entries.length === 1 ? 'record' : 'records'}{' '}
              found
            </p>
            {(query || (!barangaysOnly && type) || sort !== 'name') && (
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
          {barangaysOnly ? (
            <>
              <div
                className="table-scroll"
                role="region"
                aria-label="Barangay census table"
                tabIndex={0}
              >
                <table className="records-table">
                  <caption>
                    2024 POPCEN counts · PSA barangay list dated 31 July 2025
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Barangay</th>
                      <th scope="col">PSGC identifier</th>
                      <th scope="col">Census population</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(item => (
                      <tr key={item.id}>
                        <th scope="row">
                          <Link to={directoryHref(item)}>{item.name}</Link>
                        </th>
                        <td className="tabular-nums">{item.id}</td>
                        <td className="tabular-nums">
                          {formatNumber(
                            cityData.barangays.find(
                              record => record.id === item.id
                            )!.population
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <SourceLinks ids={cityData.profile.sourceIds} />
            </>
          ) : (
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
                    <Link to={directoryHref(item)}>{item.name}</Link>
                  </Heading>
                  <Text className="text-gray-800">{item.details}</Text>
                  <SourceLinks ids={item.sourceIds} />
                </article>
              ))}
            </div>
          )}
        </Section>
      </main>
    </>
  );
}
