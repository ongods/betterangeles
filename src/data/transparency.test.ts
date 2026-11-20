import { expect, it } from 'vitest';
import {
  formatMoney,
  formatRecordAmount,
  procurementDeadline,
  publicRecords,
  recordContexts,
  searchPublicRecords,
} from './transparency';

it('filters by type and reference period without combining incompatible amounts', () => {
  expect(
    searchPublicRecords('market', 'Project', '2024').map(item => item.id)
  ).toEqual(['pampang-market']);
  expect(searchPublicRecords('market', 'Project', '2025')).toEqual([]);
  expect(searchPublicRecords('', 'Budget')).toEqual([]);
  expect(formatMoney(null)).toBe('Amount not confirmed');
  expect(formatMoney(1705000)).toContain('1,705,000.00');
  expect(formatRecordAmount(publicRecords[0])).toBe('Not applicable');
  expect(
    formatRecordAmount({ ...publicRecords[0], amountState: 'unknown' })
  ).toBe('Amount not confirmed');
  expect(
    publicRecords
      .filter(item => item.kind === 'Project')
      .every(item => item.progress === null)
  ).toBe(true);
});
it('retains raw Active status after the submission deadline without inferring award', () => {
  const context = recordContexts['philgeps-13222581'];
  expect(context.sourceStatus).toBe('Active');
  expect(procurementDeadline(context, new Date('2026-09-07T05:00:01Z'))).toBe(
    'Listed deadline has elapsed; award status is unverified'
  );
  expect(
    procurementDeadline(context, new Date('2026-09-07T04:59:59Z'))
  ).toContain('Within the listed submission period');
  expect(context.sourceStatus).toBe('Active');
});
