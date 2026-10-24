import { describe, expect, it } from 'vitest';
import {
  getCategorySubcategories,
  isNestedCategory,
  loadCategoryIndex,
  serviceCategories,
} from './yamlLoader';

describe('category loading', () => {
  it.each(serviceCategories.categories)(
    'registers the $slug service category with a usable page index',
    async category => {
      expect(isNestedCategory(category.slug)).toBe(true);

      const index = await loadCategoryIndex(category.slug);
      expect(index.pages.length).toBeGreaterThan(0);
      expect(['list', 'grid']).toContain(index.layout);

      const slugs = index.pages.map(page => page.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const page of index.pages) {
        expect(page.name.trim()).not.toBe('');
        expect(page.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      }
    }
  );

  it('loads the government department index', async () => {
    const index = await loadCategoryIndex('departments');

    expect(isNestedCategory('departments')).toBe(true);
    expect(index.pages.some(page => page.slug === 'executive')).toBe(true);
  });

  it('returns an empty list for an unregistered category', async () => {
    expect(isNestedCategory('harness-missing-category')).toBe(false);
    await expect(
      loadCategoryIndex('harness-missing-category')
    ).resolves.toEqual({
      layout: 'list',
      pages: [],
    });
  });

  it('reuses cached category data', async () => {
    const category = serviceCategories.categories[0].slug;
    const first = await getCategorySubcategories(category);
    const second = await getCategorySubcategories(category);

    expect(first.pages.length).toBeGreaterThan(0);
    expect(second).toBe(first);
  });
});
