import {
  serviceCategories,
  getCategorySubcategories,
  type Subcategory,
} from './yamlLoader';
import { serviceMetadata } from './serviceMetadata';

export interface ServiceEntry extends Subcategory {
  categorySlug: string;
  categoryName: string;
  href: string;
  available: boolean;
  onlineUrl?: string;
  synonyms: string[];
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
  onlineOnly = false
): ServiceEntry[] {
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  return entries.filter(entry => {
    if (!entry.available || (category && entry.categorySlug !== category)) {
      return false;
    }
    if (onlineOnly && !entry.onlineUrl) return false;
    const text = normalizeSearch(
      [
        entry.name,
        entry.description,
        entry.categoryName,
        ...entry.synonyms,
      ].join(' ')
    );
    return words.every(word => text.includes(word));
  });
}
