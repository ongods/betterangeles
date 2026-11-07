import { cityData } from './cityData';
import { normalizeSearch } from './serviceCatalog';

export interface DirectoryEntry {
  id: string;
  name: string;
  type: string;
  details: string;
  sourceIds: string[];
}

export const directoryEntries: DirectoryEntry[] = [
  ...cityData.barangays.map(item => ({
    ...item,
    type: 'Barangay',
    details: `${item.population.toLocaleString('en-PH')} residents · 2024 POPCEN. PSGC ${item.id}. Hall contacts and coordinates are not yet verified.`,
  })),
  ...cityData.publicSchools.map(item => ({
    ...item,
    type: 'Public school',
    details: `School ID ${item.id}. ${item.address ?? 'Address not provided in the available records.'} National Inventory Dashboard records and selected SDO address records; current enrollment and directory completeness are unconfirmed.${item.notes ? ' ' + item.notes : ''}`,
  })),
  ...cityData.privateSchools.map(item => ({
    ...item,
    type: 'Private school',
    details: `School ID ${item.id}. ${item.address}. Listed for SY ${item.schoolYear}; authorization for a later school year is not established.`,
  })),
  ...cityData.healthUnits.map(item => ({
    ...item,
    type: 'TB-program health unit',
    details: `${item.address}. Listed in DOH TB-program directories; clinic hours and current service availability are unconfirmed.`,
  })),
  ...cityData.offices.map(item => ({
    ...item,
    type: 'City office',
    details: `${item.details}. ${item.evidence}. Details are as recorded in the October source extraction; confirm appointments and transaction hours.`,
  })),
];

export function searchDirectory(query: string, type = ''): DirectoryEntry[] {
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  return directoryEntries.filter(item => {
    if (type && item.type !== type) return false;
    const text = normalizeSearch(`${item.name} ${item.id} ${item.details}`);
    return words.every(word => text.includes(word));
  });
}
