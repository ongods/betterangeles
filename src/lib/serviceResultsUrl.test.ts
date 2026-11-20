import { describe, expect, it } from 'vitest';
import { serviceResultsUrl } from './serviceResultsUrl';
describe('returning from a service guide', () => {
  it('restores the category and selected filters, including office names with spaces', () => {
    expect(
      serviceResultsUrl({
        serviceResults: {
          path: '/services/business',
          search: 'q=permit&office=City+Hall',
        },
      })
    ).toBe('/services/business?q=permit&office=City+Hall');
  });
  it('omits a results link on direct entry and ignores unrelated navigation state', () => {
    expect(serviceResultsUrl(null)).toBeNull();
    expect(
      serviceResultsUrl({
        serviceResults: { path: '//example.org', search: '' },
      })
    ).toBeNull();
  });
});
