import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <main id="main-content" className="flex-grow">
      <SEO title="Page not found" />
      <Section>
        <Heading>Page not found</Heading>
        <Text className="mb-6">
          This address does not have a published page.
        </Text>
        <p>
          <Link to="/services">Search service guides</Link> or{' '}
          <Link to="/">return home</Link>.
        </p>
      </Section>
    </main>
  );
}
