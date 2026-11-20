import { Heading } from '../ui/Heading';
import SourceLinks from '../ui/SourceLinks';
import { serviceMetadata } from '../../data/serviceMetadata';

export default function ServiceFacts({ serviceKey }: { serviceKey: string }) {
  const metadata = serviceMetadata[serviceKey];
  const details = metadata?.details;
  const unknown = 'Not confirmed. Check with the responsible office.';
  return (
    <section className="service-facts mb-8" aria-label="Plan your application">
      <Heading level={2} className="text-2xl md:text-2xl lg:text-2xl">
        Plan your application
      </Heading>
      {metadata?.onlineUrl && (
        <a
          className="action-button inline-block mb-6"
          href={metadata.onlineUrl}
        >
          {serviceKey.startsWith('business/')
            ? 'Open official eBPLS'
            : 'Open official Health ID portal'}
        </a>
      )}
      <dl className="facts-grid">
        {[
          ['Who may apply', details?.eligibility],
          ['Responsible office', metadata?.office],
          [
            'Access',
            metadata?.access
              ?.map(mode =>
                mode === 'online'
                  ? 'Online application or appointment'
                  : 'Walk-in (dated guide)'
              )
              .join(', '),
          ],
          ['Fees', details?.fees],
          ['Processing time', details?.processingTime],
          ['Office location', details?.location],
          ['Published contacts', details?.contacts],
          ['Current office hours', details?.hours],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value ?? unknown}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-sm text-gray-700">
        {details?.referenceDate ??
          'Consult the dated requirements, steps, fees, and sources in the guide below. Current arrangements may differ.'}
      </p>
      {details && (
        <>
          <SourceLinks ids={details.sourceIds} />
          <div className="mt-6">
            <Heading level={3} className="text-lg md:text-lg lg:text-lg">
              Downloadable forms
            </Heading>
            {details.forms.length ? (
              details.forms.map(form => (
                <p key={form.url}>
                  <a href={form.url}>{form.title}</a>
                </p>
              ))
            ) : (
              <p>A form has not been confirmed.</p>
            )}
          </div>
          <div className="mt-6">
            <Heading level={3} className="text-lg md:text-lg lg:text-lg">
              Common questions
            </Heading>
            {details.faqs.map(faq => (
              <details
                key={faq.question}
                className="py-3 border-b border-gray-200"
              >
                <summary className="font-semibold cursor-pointer">
                  {faq.question}
                </summary>
                <p className="mt-3 max-w-3xl">{faq.answer}</p>
              </details>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
