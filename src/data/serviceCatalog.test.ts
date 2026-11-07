import { describe, expect, it } from 'vitest';
import {
  hasServicePage,
  loadServiceCatalog,
  searchServices,
} from './serviceCatalog';
import { searchDirectory } from './directory';

describe('published service discovery', () => {
  it('separates supported pages from indexed source gaps', async () => {
    const catalog = await loadServiceCatalog();
    expect(catalog.filter(item => item.available)).toHaveLength(42);
    expect(catalog.filter(item => !item.available)).toHaveLength(17);
    const gap = catalog.find(
      item => item.slug === 'join-livelihood-or-skills-training-programs'
    );
    expect(gap?.available).toBe(false);
    expect(
      searchServices(catalog, 'livelihood').every(item => item.available)
    ).toBe(true);
    expect(hasServicePage('business', 'not-a-published-guide')).toBe(false);
  });

  it('supports resident search terms, punctuation, combined filters and empty results', async () => {
    const catalog = await loadServiceCatalog();
    const matches = searchServices(
      catalog,
      'HEALTH-ID',
      'health-services',
      true
    );
    expect(matches).toHaveLength(1);
    expect(matches[0].onlineUrl).toBe('https://cityofangeles.ph/healthcard/');
    expect(searchServices(catalog, 'health ID', 'business', true)).toEqual([]);
    expect(searchServices(catalog, 'xyz-no-matching-service')).toEqual([]);
    expect(searchServices(catalog, '', '', true)).toHaveLength(3);
    expect(searchServices(catalog, '')).toHaveLength(42);
  });
});

describe('directory search', () => {
  it('preserves conflicting school IDs with an explicit unresolved relationship', () => {
    const records = searchDirectory('Enrica', 'Public school');
    expect(records.map(item => item.id).sort()).toEqual(['107028', '502867']);
    expect(
      records.every(item => item.details.includes('Source conflict:'))
    ).toBe(true);
    expect(
      records.every(item =>
        item.details.includes(
          'relationship between these records is unconfirmed'
        )
      )
    ).toBe(true);
  });
  it('matches accents and identifiers without changing canonical names', () => {
    expect(searchDirectory('malabanas', 'Barangay')[0].name).toBe('Malabañas');
    expect(searchDirectory('0330100001', 'Barangay')[0].name).toBe(
      'Agapito del Rosario'
    );
    expect(searchDirectory('', 'Barangay')).toHaveLength(33);
    expect(searchDirectory('no-such-place')).toEqual([]);
  });

  it('keeps historical authorization and TB directory scope visible', () => {
    expect(
      searchDirectory('', 'Private school').every(item =>
        item.details.includes('2025–2026')
      )
    ).toBe(true);
    expect(
      searchDirectory('', 'TB-program health unit').every(item =>
        item.details.includes('DOH TB-program')
      )
    ).toBe(true);
  });
});
