import { describe, expect, it } from 'vitest';
import {
  directionsUrl,
  distanceKm,
  mapLayers,
  mapPlaces,
  searchMapPlaces,
  validatedCoordinates,
} from './map';
import type { Coordinates } from '../types/records';

const point: Coordinates = {
  latitude: 15,
  longitude: 120,
  sourceUrl: 'https://example.test/fixture',
  checkedOn: '2030-01-01',
  state: 'validated',
};
describe('map publication gates', () => {
  it('keeps all requested layers and renders no invented coordinates', () => {
    expect(mapLayers).toHaveLength(16);
    expect(mapPlaces.length).toBeGreaterThan(0);
    expect(
      mapPlaces.filter(place => validatedCoordinates(place.coordinates))
    ).toEqual([]);
    expect(searchMapPlaces('', ['jeepney', 'flood', 'boundaries'])).toEqual([]);
  });
  it('composes names and selected layers and keeps usable text without geometry', () => {
    expect(
      searchMapPlaces('pamintuan', ['heritage']).map(item => item.name)
    ).toEqual(['Pamintuan Mansion']);
    expect(searchMapPlaces('pamintuan', ['schools'])).toEqual([]);
    expect(searchMapPlaces('xyz-not-a-place', [])).toEqual([]);
  });
  it('allows directions only for finite, validated, attributed coordinates', () => {
    expect(directionsUrl(null)).toBeNull();
    expect(directionsUrl({ ...point, state: 'candidate' })).toBeNull();
    expect(directionsUrl({ ...point, latitude: 95 })).toBeNull();
    expect(directionsUrl({ ...point, longitude: NaN })).toBeNull();
    expect(directionsUrl({ ...point, sourceUrl: '' })).toBeNull();
    expect(directionsUrl(point)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=15,120'
    );
    expect(distanceKm(point, point)).toBeCloseTo(0);
  });
});
