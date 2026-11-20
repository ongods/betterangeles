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
  type CategoryIndex,
} from '../data/yamlLoader';
import NotFound from './NotFound';
import { cityData } from '../data/cityData';
import SourceLinks from '../components/ui/SourceLinks';

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
  const sections = [
    {
      title: 'Executive Branch',
      href: '/government/departments/executive',
      description:
        'Published mayor and vice-mayor information, with dates and source limits.',
    },
    {
      title: 'Legislative Branch',
      href: '/government/departments/legislative',
      description:
        'Read the sourced council roster and compare the dated records.',
    },
    {
      title: 'Key Departments',
      href: '/directory?type=City+office',
      description:
        'Find the available office records and published contact details.',
    },
    {
      title: 'Barangay Directory',
      href: '/government/barangays',
      description:
        'All 33 barangays, PSGC identifiers, 2024 census counts, and qualified official records.',
    },
    {
      title: 'Citizen’s Charter',
      href: '/transparency/ebpls-charter',
      description:
        'Read the available eBPLS charter. Its scope is business permits; it does not cover every city office.',
    },
  ];
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
              {sections.map(item => (
                <article key={item.href} className="py-5">
                  <Heading
                    level={2}
                    className="text-xl md:text-2xl lg:text-2xl"
                  >
                    <Link to={item.href}>{item.title}</Link>
                  </Heading>
                  <Text>{item.description}</Text>
                </article>
              ))}
              <section className="pt-10">
                <Heading level={2}>Published office contacts</Heading>
                <p className="max-w-3xl mb-6">
                  These records were collected in October 2026. Confirm current
                  staff, working lines, locations, and hours with the office.
                  They are not a verified current hotline directory.
                </p>
                <div className="grid md:grid-cols-2 gap-x-12">
                  {cityData.offices.map(office => (
                    <article
                      key={office.id}
                      className="py-5 border-b border-gray-200"
                    >
                      <Heading
                        level={3}
                        className="text-xl md:text-xl lg:text-xl"
                      >
                        <Link to={`/directory/city-office/${office.id}`}>
                          {office.name}
                        </Link>
                      </Heading>
                      <p>{office.details}</p>
                      <SourceLinks ids={office.sourceIds} />
                    </article>
                  ))}
                </div>
                <p className="mt-6">
                  <Link to="/government/departments/office-schedules">
                    Check dated City Hall schedule advice
                  </Link>
                </p>
              </section>
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
