import { Search } from 'lucide-react';

export default function ServiceSearchForm() {
  return (
    <form action="/services" method="get" role="search" className="max-w-2xl">
      <label htmlFor="home-service-query" className="block font-semibold mb-2">
        What do you need to do?
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="home-service-query"
          name="q"
          type="search"
          placeholder="Try business permit, birth certificate, or health ID"
          className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-700"
        />
        <button
          type="submit"
          className="action-button inline-flex justify-center items-center gap-2"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search services
        </button>
      </div>
    </form>
  );
}
