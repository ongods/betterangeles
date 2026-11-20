import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { searchServices } from '../../data/serviceCatalog';
import { useServiceCatalog } from '../../hooks/useServiceCatalog';

export default function ServiceSearchForm() {
  const [query, setQuery] = useState('');
  const { entries, error } = useServiceCatalog();
  const navigate = useNavigate();
  const term = query.trim();
  const href = term
    ? '/services?' + new URLSearchParams({ q: term }).toString()
    : '/services';
  const matches = term && entries ? searchServices(entries, term) : [];

  return (
    <form
      action="/services"
      method="get"
      role="search"
      className="mt-6"
      onSubmit={event => {
        event.preventDefault();
        Promise.resolve(navigate(href)).catch(() =>
          window.location.assign(href)
        );
      }}
    >
      <label
        htmlFor="home-service-query"
        className="mb-2 block text-sm font-semibold"
      >
        Search service guides
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-700"
          />
          <input
            id="home-service-query"
            name="q"
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Business permit, health ID, cedula…"
            className="h-14 w-full rounded-lg bg-white pl-12 pr-4 text-gray-900"
          />
        </div>
        <button type="submit" className="action-button min-h-12">
          Search guides
        </button>
      </div>
      <span className="sr-only" role="status">
        {term && entries ? matches.length + ' matching guides' : ''}
      </span>
      {term && (
        <div className="mt-2 rounded-lg bg-white px-4 text-gray-900">
          {matches.slice(0, 4).map(entry => (
            <Link
              key={entry.href}
              to={entry.href}
              className="flex items-center justify-between gap-3 border-b border-gray-200 py-3 font-semibold"
            >
              <span>
                {entry.name}
                <small className="block font-normal text-gray-700">
                  {entry.categoryName}
                </small>
              </span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          ))}
          {matches.length ? (
            <Link className="inline-block py-3 font-semibold" to={href}>
              See all results ({matches.length})
            </Link>
          ) : (
            <p className="py-3">
              {error
                ? 'Suggestions could not be loaded.'
                : entries
                  ? 'No matching guides.'
                  : 'Searching guides…'}{' '}
              <Link to="/services">Browse services</Link>
            </p>
          )}
        </div>
      )}
    </form>
  );
}
