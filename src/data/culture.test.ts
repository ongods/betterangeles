import { describe, expect, it } from 'vitest';
import { getEventStatus, getPhilippineDate } from './culture';
import { hasMarkdownContent } from '../lib/markdownLoader';

describe('dated event presentation', () => {
  it('uses Philippine calendar days at a UTC boundary', () => {
    expect(
      getEventStatus(
        '2026-10-30',
        '2026-10-30',
        new Date('2026-10-30T15:59:59Z')
      )
    ).toBe('Scheduled today');
    expect(
      getEventStatus(
        '2026-10-30',
        '2026-10-30',
        new Date('2026-10-30T16:00:00Z')
      )
    ).toBe('Past event');
    expect(
      getEventStatus(
        '2026-10-30',
        '2026-10-30',
        new Date('2026-10-29T00:00:00Z')
      )
    ).toBe('Upcoming event');
  });

  it('keeps multi-day events on their published dates and computes the current Philippine date', () => {
    expect(
      getEventStatus(
        '2026-10-23',
        '2026-10-24',
        new Date('2026-10-24T10:00:00Z')
      )
    ).toBe('Scheduled today');
    expect(getPhilippineDate(new Date('2030-05-01T16:00:00Z'))).toBe(
      '2030-05-02'
    );
  });
});

it('recognizes the legislative Markdown page even though its slug has a nested index', () => {
  expect(hasMarkdownContent('legislative', 'departments', 'government')).toBe(
    true
  );
  expect(hasMarkdownContent('unknown', 'departments', 'government')).toBe(
    false
  );
});
