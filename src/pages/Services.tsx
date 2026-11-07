import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import { serviceCategories } from '../data/yamlLoader';
import {
  loadServiceCatalog,
  searchServices,
  type ServiceEntry,
} from '../data/serviceCatalog';
import NotFound from './NotFound';

export default function Services() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const [entries, setEntries] = useState<ServiceEntry[] | null>(null);
  const [error, setError] = useState(false);
  const selectedCategory = category ?? params.get('category') ?? '';
  const query = params.get('q') ?? '';
  const onlineOnly = params.get('online') === '1';
  const categoryData = serviceCategories.categories.find(
    item => item.slug === selectedCategory
  );
  useEffect(() => {
    let active = true;
    loadServiceCatalog()
      .then(result => {
        if (active) setEntries(result);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);
  if (category && !categoryData) return <NotFound />;
  const results = searchServices(
    entries ?? [],
    query,
    selectedCategory,
    onlineOnly
  );
  const gaps = (entries ?? []).filter(
    item =>
      !item.available &&
      (!selectedCategory || item.categorySlug === selectedCategory)
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
        title={categoryData?.category ?? 'Services'}
        description="Find Angeles City service guides, requirements, forms, and official application links."
      />
      <main id="main-content" className="flex-grow">
        <Section>
          <Breadcrumbs className="mb-6" />
          <Heading>{categoryData?.category ?? 'Find a service'}</Heading>
          <Text className="max-w-3xl text-gray-800 mb-8">
            Search the available guides. Requirements and fees retain their
            source dates; confirm current arrangements with the responsible
            office.
          </Text>
          <form
            role="search"
            onSubmit={event => event.preventDefault()}
            className="search-panel mb-8"
          >
            <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
              <div>
                <label htmlFor="service-query">Search services</label>
                <input
                  id="service-query"
                  type="search"
                  value={query}
                  onChange={event => update('q', event.target.value)}
                  placeholder="Business permit, cedula, health ID…"
                />
              </div>
              {!category && (
                <div>
                  <label htmlFor="service-category">Category</label>
                  <select
                    id="service-category"
                    value={selectedCategory}
                    onChange={event => update('category', event.target.value)}
                  >
                    <option value="">All categories</option>
                    {serviceCategories.categories.map(item => (
                      <option key={item.slug} value={item.slug}>
                        {item.category}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <label className="inline-flex items-center gap-2 font-normal">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={event =>
                    update('online', event.target.checked ? '1' : '')
                  }
                />
                Has an online application link
              </label>
              {(query || onlineOnly || (!category && selectedCategory)) && (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setParams({}, { replace: true })}
                >
                  Clear filters
                </button>
              )}
            </div>
          </form>
          {error ? (
            <div role="alert">
              <Heading level={2}>Service guides could not be loaded</Heading>
              <Text>
                Reload this page to try again, or visit{' '}
                <Link to="/contact">Contact & Help</Link>.
              </Text>
            </div>
          ) : entries === null ? (
            <p role="status">Loading service guides…</p>
          ) : (
            <>
              <p role="status" aria-live="polite" className="mb-5 font-medium">
                {results.length} {results.length === 1 ? 'guide' : 'guides'}{' '}
                found
              </p>
              {results.length === 0 && (
                <div className="py-8">
                  <Heading level={2}>No guides match these filters</Heading>
                  <Text>
                    Try a shorter search or clear the filters. Some topics are
                    still awaiting source information.
                  </Text>
                </div>
              )}
              <div className="divide-y divide-gray-200">
                {results.map(entry => (
                  <article key={entry.href} className="py-5 max-w-4xl">
                    <p className="text-sm text-gray-700 mb-1">
                      {entry.categoryName}
                      {entry.onlineUrl &&
                        ' · Online application link available'}
                    </p>
                    <Heading
                      level={2}
                      className="text-xl md:text-xl lg:text-xl mb-2"
                    >
                      <Link to={entry.href}>{entry.name}</Link>
                    </Heading>
                    <Text className="text-gray-800">{entry.description}</Text>
                  </article>
                ))}
              </div>
              {gaps.length > 0 && (
                <details className="mt-10 border-t border-gray-200 pt-6">
                  <summary className="cursor-pointer font-semibold">
                    {gaps.length} topics awaiting source information
                  </summary>
                  <p className="mt-3 max-w-3xl text-gray-800">
                    These topics are not included in search results because a
                    supported guide is not available yet. This describes our
                    information coverage, not whether the city offers a service.
                  </p>
                  <ul className="mt-4 list-disc pl-6 space-y-2">
                    {gaps.map(entry => (
                      <li key={entry.href}>{entry.name}</li>
                    ))}
                  </ul>
                  <p className="mt-4">
                    <Link to="/contact">
                      Help us improve the available information
                    </Link>
                  </p>
                </details>
              )}
            </>
          )}
        </Section>
      </main>
    </>
  );
}
