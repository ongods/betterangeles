import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  FileText,
  GraduationCap,
  HandHeart,
  HeartPulse,
  House,
  Receipt,
  Trash2,
} from 'lucide-react';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { serviceCategories } from '../../data/yamlLoader';
import { useServiceCatalog } from '../../hooks/useServiceCatalog';

const featuredTopics = [
  ['civil-documents', FileText],
  ['business', Building2],
  ['health-services', HeartPulse],
  ['taxes-fees', Receipt],
  ['social-welfare', HandHeart],
  ['education', GraduationCap],
  ['housing-land-use', House],
  ['garbage-waste-disposal', Trash2],
] as const;

export default function BrowseTopics() {
  const { entries } = useServiceCatalog();
  return (
    <Section>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <Heading level={2} className="mb-0">
          Browse by topic
        </Heading>
        <Link
          className="inline-flex items-center gap-1 font-semibold"
          to="/services"
        >
          All service topics{' '}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {featuredTopics.map(([slug, Icon]) => {
          const topic = serviceCategories.categories.find(
            item => item.slug === slug
          );
          if (!topic) return null;
          const count = entries?.filter(
            entry => entry.available && entry.categorySlug === slug
          ).length;
          return (
            <li key={slug}>
              <Link className="topic-card" to={'/services/' + slug}>
                <Icon
                  className="size-9 rounded-lg bg-primary-50 p-2 text-primary-700"
                  aria-hidden="true"
                />
                <span className="font-semibold">{topic.category}</span>
                {count !== undefined && (
                  <small>
                    {count} {count === 1 ? 'guide' : 'guides'}
                  </small>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
