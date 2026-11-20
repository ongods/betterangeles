import { directoryEntries, directoryHref } from './directory';
import { cityData } from './cityData';
import { publicRecords } from './transparency';
import { normalizeSearch } from './serviceCatalog';
import type { Coordinates } from '../types/records';

export const mapLayers = [
  ['boundaries', 'Barangay boundaries'],
  ['offices', 'City government offices'],
  ['halls', 'Barangay halls'],
  ['health', 'Hospitals and health centres'],
  ['emergency', 'Police and fire stations'],
  ['schools', 'Schools'],
  ['tourism', 'Tourist attractions'],
  ['heritage', 'Heritage locations'],
  ['jeepney', 'Jeepney routes'],
  ['terminals', 'Transport terminals'],
  ['parking', 'Parking'],
  ['evacuation', 'Evacuation centres'],
  ['markets', 'Public markets'],
  ['closures', 'Road closures'],
  ['flood', 'Flood-prone areas'],
  ['projects', 'Government projects'],
] as const;
export type MapLayerId = (typeof mapLayers)[number][0];
export interface MapPlace {
  id: string;
  name: string;
  layer: MapLayerId;
  details: string;
  href: string;
  sourceIds: string[];
  coordinates: Coordinates | null;
}

/** Viewport only, never a facility position or an administrative boundary. */
export const mapConfig = {
  center: [15.15, 120.58333] as [number, number],
  centerSource: 'https://digital.library.unt.edu/explore/locations/p12624/',
  zoom: 12,
  tileUrl:
    import.meta.env.VITE_MAP_TILE_URL ||
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    import.meta.env.VITE_MAP_ATTRIBUTION ||
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
};

const directoryLayers: Record<string, MapLayerId> = {
  'City office': 'offices',
  'Public school': 'schools',
  'Private school': 'schools',
  'TB-program health unit': 'health',
};

export const mapPlaces: MapPlace[] = [
  ...directoryEntries
    .filter(item => directoryLayers[item.type])
    .map(item => ({
      id: `${item.type}-${item.id}`,
      name: item.name,
      layer: directoryLayers[item.type],
      details: item.details,
      sourceIds: item.sourceIds,
      href: directoryHref(item),
      coordinates: null,
    })),
  ...cityData.heritage.map(item => ({
    id: item.id,
    name: item.name,
    layer: 'heritage' as const,
    details: `${item.address}. ${item.summary}. Visitor hours and fees are unconfirmed.`,
    sourceIds: item.sourceIds,
    href: `/about#${item.id}`,
    coordinates: null,
  })),
  ...publicRecords
    .filter(item => item.kind === 'Project')
    .map(item => ({
      id: item.id,
      name: item.title,
      layer: 'projects' as const,
      details: item.summary,
      sourceIds: item.sourceIds,
      href: `/transparency/${item.id}`,
      coordinates: null,
    })),
];

export function validatedCoordinates(
  value: Coordinates | null
): value is Coordinates {
  return (
    value !== null &&
    value.state === 'validated' &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude) &&
    Math.abs(value.latitude) <= 90 &&
    Math.abs(value.longitude) <= 180 &&
    /^https:\/\//.test(value.sourceUrl) &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.checkedOn)
  );
}

export function searchMapPlaces(
  query: string,
  layers: string[],
  records = mapPlaces
): MapPlace[] {
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  return records.filter(
    item =>
      (!layers.length || layers.includes(item.layer)) &&
      words.every(word =>
        normalizeSearch(`${item.name} ${item.details}`).includes(word)
      )
  );
}

export function directionsUrl(coordinates: Coordinates | null): string | null {
  if (!validatedCoordinates(coordinates)) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
}

export function distanceKm(
  a: { latitude: number; longitude: number },
  b: Coordinates
): number {
  const radians = Math.PI / 180;
  const lat = (b.latitude - a.latitude) * radians;
  const lng = (b.longitude - a.longitude) * radians;
  const term =
    Math.sin(lat / 2) ** 2 +
    Math.cos(a.latitude * radians) *
      Math.cos(b.latitude * radians) *
      Math.sin(lng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(term), Math.sqrt(1 - term));
}
