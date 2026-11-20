import { expect, it } from 'vitest';
import { contactText, telephoneHref } from './contacts';
import officials from '../data/barangayOfficials.json';
import { cityData } from '../data/cityData';
it('keeps the 33 captain rows qualified and never enables unverified call links', () => {
  expect(new Set(officials.map(item => item.barangayId)).size).toBe(33);
  expect(
    officials.every(item =>
      cityData.barangays.some(barangay => barangay.id === item.barangayId)
    )
  ).toBe(true);
  expect(officials.every(item => telephoneHref(item.rawContact) === null)).toBe(
    true
  );
  for (const raw of ['NONE', 'N/A', '0', 'Not provided (NONE)'])
    expect(contactText(raw)).toBe('Not provided in the source');
  for (const raw of ['099909990638', '0905561416', '0928401'])
    expect(telephoneHref(raw, true)).toBeNull();
  expect(telephoneHref('09123456789', true)).toBe('tel:09123456789');
});
