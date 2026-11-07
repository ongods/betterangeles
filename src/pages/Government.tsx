import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import {
  governmentCategories,
  getCategorySubcategories,
  isNestedCategory,
  type CategoryIndex,
} from '../data/yamlLoader';
import NotFound from './NotFound';

export default function Government() {
  const { category } = useParams();
  const [index, setIndex] = useState<CategoryIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const categoryData = governmentCategories.categories.find(
    item => item.slug === category
  );
  useEffect(() => {
    if (!category) return;
    let active = true;
    getCategorySubcategories(category)
      .then(result => {
        if (active) setIndex(result);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [category]);
  if (category && !categoryData) return <NotFound />;
  const title = categoryData?.category ?? 'Government information';
  const categories = governmentCategories.categories.filter(item =>
    isNestedCategory(item.slug)
  );
  return (
    <>
      <SEO
        title={title}
        description="Angeles City government records, source dates, and guidance for using BetterAngeles."
      />
      <main id="main-content" className="flex-grow">
        <Section>
          <Breadcrumbs className="mb-6" />
          <Heading>{title}</Heading>
          <Text className="max-w-3xl mb-7 text-gray-800">
            {categoryData?.description ??
              'Explore the available government information. Records retain their source dates and may not establish current appointments or hours.'}
          </Text>
          {!category ? (
            <div className="divide-y divide-gray-200">
              {categories.map(item => (
                <article key={item.slug} className="py-5">
                  <Heading
                    level={2}
                    className="text-xl md:text-2xl lg:text-2xl"
                  >
                    <Link to={'/government/' + item.slug}>{item.category}</Link>
                  </Heading>
                  <Text>{item.description}</Text>
                </article>
              ))}
            </div>
          ) : failed ? (
            <p role="alert">
              This section could not be loaded. Reload the page to try again.
            </p>
          ) : !index ? (
            <p role="status">Loading government information…</p>
          ) : index.pages.length === 0 ? (
            <>
              <Heading level={2}>Information is not available yet</Heading>
              <Text>
                This section has no supported pages.{' '}
                <Link to="/government">
                  Browse available government information
                </Link>
                .
              </Text>
            </>
          ) : (
            <div className="divide-y divide-gray-200">
              {index.pages.map(page => (
                <article key={page.slug} className="py-5 max-w-4xl">
                  <Heading
                    level={2}
                    className="text-xl md:text-2xl lg:text-2xl"
                  >
                    <Link to={'/government/' + category + '/' + page.slug}>
                      {page.name}
                    </Link>
                  </Heading>
                  <Text>{page.description}</Text>
                </article>
              ))}
            </div>
          )}
        </Section>
      </main>
    </>
  );
}
