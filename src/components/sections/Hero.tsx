import { Link } from 'react-router-dom';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import ServiceSearchForm from '../ui/ServiceSearchForm';

export default function Hero() {
  return (
    <section className="dark-surface bg-primary-800 text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <Heading className="max-w-3xl text-white leading-tight mb-5">
          Your guide to Angeles City
        </Heading>
        <Text className="max-w-2xl text-primary-100 mb-8">
          Find service requirements, prepare for a visit, and get to the right
          government office.
        </Text>
        <ServiceSearchForm />
        <p className="mt-5 text-sm text-primary-100">
          A community guide. Transactions take place through{' '}
          <a
            className="text-white underline"
            href="https://angelescity.gov.ph/"
          >
            official city services
          </a>
          .
        </p>
        <Link to="/services" className="inline-block mt-4 text-white underline">
          Browse all service guides
        </Link>
      </div>
    </section>
  );
}
