import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Heading } from '../ui/Heading';
import ServiceSearchForm from '../ui/ServiceSearchForm';

const quickLinks = [
  [
    'Start a business',
    '/services/business/apply-for-barangay-clearance-and-mayors-business-permits',
  ],
  [
    'Request civil documents',
    '/services/civil-documents/request-certified-civil-registry-documents',
  ],
  [
    'Apply for a health ID',
    '/services/health-services/apply-for-worker-health-certificate-cards',
  ],
  ['Find a barangay or school', '/directory'],
  [
    'Check City Hall schedule advice',
    '/government/departments/office-schedules',
  ],
];

export default function Hero() {
  return (
    <section className="dark-surface bg-primary-800 text-white">
      <div className="civic-container grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-14">
        <div>
          <Heading className="max-w-2xl text-4xl text-white sm:text-5xl">
            Find a city service and know what to bring
          </Heading>
          <p className="max-w-xl text-lg text-primary-100">
            Prepare for your visit, find the responsible office, and continue to
            the official portal when you’re ready.
          </p>
          <ServiceSearchForm />
          <div
            className="mt-5 flex flex-wrap gap-2"
            aria-label="Suggested searches"
          >
            {['Business permit', 'Health ID', 'Cedula'].map(term => (
              <Link
                className="hero-chip"
                to={'/services?' + new URLSearchParams({ q: term }).toString()}
                key={term}
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
        <nav
          aria-label="Quick links"
          className="rounded-xl border border-white/20 bg-white/5 p-5"
        >
          <h2 className="mb-2 font-semibold text-primary-100">Start here</h2>
          <ul className="divide-y divide-white/15">
            {quickLinks.map(([label, to]) => (
              <li key={to}>
                <Link className="hero-shortcut" to={to}>
                  {label}
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Link className="hero-all" to="/services">
            Browse all guides
          </Link>
        </nav>
      </div>
    </section>
  );
}
