import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import ServiceFacts from './ServiceFacts';
it('keeps unknown health fees and hours explicit and links the real appointment system', () => {
  const html = renderToStaticMarkup(
    <ServiceFacts serviceKey="health-services/apply-for-worker-health-certificate-cards" />
  );
  expect(html).toContain('Not confirmed. Check with the responsible office.');
  expect(html).toContain('https://cityofangeles.ph/healthcard/');
  expect(html).toContain('Advisory No. 002');
  expect(html).not.toContain('Free');
  expect(html).not.toContain('tel:');
});
it('retains conditional business processing and the official service destination', () => {
  const html = renderToStaticMarkup(
    <ServiceFacts serviceKey="business/apply-for-barangay-clearance-and-mayors-business-permits" />
  );
  expect(html).toContain('conditional on payment within that period');
  expect(html).toContain('https://www.cityofangeles.ph/bpls/#services');
  expect(html).toContain('revision 33');
});
