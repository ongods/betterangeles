import {
  serviceCategories,
  getCategorySubcategories,
  type Subcategory,
} from './yamlLoader';
import { serviceMetadata, serviceTopics } from './serviceMetadata';

export interface ServiceEntry extends Subcategory {
  categorySlug: string;
  categoryName: string;
  href: string;
  available: boolean;
  onlineUrl?: string;
  synonyms: string[];
  access: ('online' | 'walk-in')[] | null;
  office: string | null;
  audiences: string[] | null;
}

const serviceFiles = new Set(
  Object.keys(import.meta.glob('../../content/services/*/*.md'))
);

export function hasServicePage(category: string, slug: string): boolean {
  return serviceFiles.has(`../../content/services/${category}/${slug}.md`);
}

let catalogPromise: Promise<ServiceEntry[]> | undefined;

export function loadServiceCatalog(): Promise<ServiceEntry[]> {
  catalogPromise ??= Promise.all(
    serviceCategories.categories.map(async category => {
      const index = await getCategorySubcategories(category.slug);
      return index.pages.map(page => {
        const metadata = serviceMetadata[`${category.slug}/${page.slug}`];
        return {
          ...page,
          categorySlug: category.slug,
          categoryName: category.category,
          href: `/services/${category.slug}/${page.slug}`,
          available: hasServicePage(category.slug, page.slug),
          onlineUrl: metadata?.onlineUrl,
          synonyms: metadata?.synonyms ?? [],
          access: metadata?.access ?? null,
          office: metadata?.office ?? null,
          audiences: metadata?.audiences ?? null,
        };
      });
    })
  )
    .then(categories => categories.flat())
    .catch((error: unknown) => {
      catalogPromise = undefined;
      throw error;
    });
  return catalogPromise;
}

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function searchServices(
  entries: ServiceEntry[],
  query: string,
  category = '',
  onlineOnly = false,
  filters: {
    access?: string;
    office?: string;
    audience?: string;
    topic?: string;
  } = {}
): ServiceEntry[] {
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  return entries.filter(entry => {
    if (!entry.available || (category && entry.categorySlug !== category)) {
      return false;
    }
    if (onlineOnly && !entry.onlineUrl) return false;
    if (filters.access === 'unknown' && entry.access !== null) return false;
    if (
      filters.access &&
      filters.access !== 'unknown' &&
      !entry.access?.some(mode => mode === filters.access)
    )
      return false;
    if (filters.office && entry.office !== filters.office) return false;
    if (filters.audience && !entry.audiences?.includes(filters.audience))
      return false;
    const topic = serviceTopics.find(item => item.name === filters.topic);
    if (
      filters.topic &&
      !topic?.categories.includes(entry.categorySlug) &&
      !topic?.serviceSlugs?.includes(entry.slug)
    )
      return false;
    const text = normalizeSearch(
      [
        entry.name,
        entry.description,
        entry.categoryName,
        entry.office ?? '',
        ...entry.synonyms,
      ].join(' ')
    );
    return words.every(word => text.includes(word));
  });
}
