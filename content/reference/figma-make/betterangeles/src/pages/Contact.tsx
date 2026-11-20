import { BookUser, Bug, CreditCard, Siren } from 'lucide-react'
import { Accordion, Card, Container, ExtLink, LinkButton, PageHeader, Section, TextLink } from '../ui'
import { LINKS, REPO, REPO_ISSUES } from '../data'

const tasks = [
  { icon: CreditCard, t: 'Apply, pay or book', d: 'BetterAngeles can’t process transactions. Use the official portals:', body: <ul className="mt-3 space-y-2 text-[15px]"><li><ExtLink href={LINKS.ebpls}>Business permit portal (eBPLS)</ExtLink></li><li><ExtLink href={LINKS.health}>Health ID portal</ExtLink></li><li><ExtLink href={LINKS.city}>Official city website</ExtLink></li></ul> },
  { icon: BookUser, t: 'Find the right office', d: 'Search offices, barangays and portals, or start from the service you need.', body: <div className="mt-4 flex flex-wrap gap-2"><LinkButton to="/directory" variant="secondary" size="sm">City Directory</LinkButton><LinkButton to="/services" variant="ghost" size="sm">Service guides</LinkButton></div> },
  { icon: Bug, t: 'Report a website mistake', d: 'Outdated, missing or wrong? Open a public issue with the page address and an official source.', body: <div className="mt-4"><LinkButton href={REPO_ISSUES} size="sm">Report a correction</LinkButton></div> },
  { icon: Siren, t: 'Emergencies', d: 'BetterAngeles has no emergency reporting and shows no hotline numbers until they are verified. Use the official emergency channels published by the city.', body: <p className="mt-3 text-[15px]"><ExtLink href={LINKS.city}>angelescity.gov.ph</ExtLink> · <ExtLink href={LINKS.pagasa}>PAGASA advisories</ExtLink></p> },
]
const faqs = [
  { q: 'Is BetterAngeles the official city website?', a: 'No. It is a community-built guide. The official website is angelescity.gov.ph.' },
  { q: 'Can I submit an application or payment here?', a: 'No. Every guide links to the official portal or office where the transaction happens. There is no form on this site that sends data to the city.' },
  { q: 'Is there an email address or contact form?', a: 'No. Corrections are handled publicly on GitHub so changes and sources stay visible.' },
  { q: 'How do I know if information is current?', a: <>Each guide shows a reference date and its sources. Sourced guides cite saved charter copies; illustrative samples are labelled. <TextLink to="/accessibility">Accessibility statement</TextLink>.</> },
]

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Help" title="Contact & Help" crumbs={[{ label: 'Contact & Help' }]} summary="Choose what you need: an official transaction, the right office, or a correction to this website." />
      <Container className="py-6">
        <ul className="grid gap-4 md:grid-cols-2">
          {tasks.map(({ icon: I, t, d, body }) => <li key={t}><Card className="h-full p-5 sm:p-6">
            <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-ctl bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-100"><I className="size-5" aria-hidden="true" /></span>
              <div className="min-w-0"><h2 className="text-lg font-bold text-primary-900">{t}</h2><p className="mt-1 text-[15px] text-muted">{d}</p>{body}</div></div>
          </Card></li>)}
        </ul>
        <Section title="Common questions" id="faq" divider className="mt-8"><div className="max-w-3xl"><Accordion items={faqs} /></div></Section>
        <p className="text-sm text-muted">BetterAngeles is maintained openly. <ExtLink href={REPO}>View the source on GitHub</ExtLink></p>
      </Container>
    </>
  )
}

export function Accessibility() {
  return (
    <>
      <PageHeader eyebrow="Help" title="Accessibility" crumbs={[{ label: 'Contact & Help', to: '/contact' }, { label: 'Accessibility' }]} summary="Our goal is WCAG 2.2 AA. This is a prototype and has not been formally audited." />
      <Container className="py-8">
        <div className="prose-doc space-y-8">
          <section aria-labelledby="a-do"><h2 id="a-do" className="text-xl font-bold text-primary-900">What we support</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>A skip link, landmarks, one main heading per page, and a visible keyboard focus ring.</li>
              <li>The menu, filters, accordions and dialogs work with a keyboard. Escape closes the mobile menu and the filter panel.</li>
              <li>Status is conveyed with text and icons, not colour alone.</li>
              <li>The map has a searchable list and a list-only mode as text alternatives.</li>
              <li>Tables become stacked lists on small screens instead of scrolling sideways.</li>
              <li>Motion is limited to short state changes and stops when your system requests reduced motion.</li>
            </ul></section>
          <section aria-labelledby="a-known"><h2 id="a-known" className="text-xl font-bold text-primary-900">Known limitations</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5"><li>The site is in English only. Other languages need reviewed copy.</li><li>The map basemap itself is not fully keyboard-explorable; use the list instead.</li></ul></section>
          <p>Found a barrier? <ExtLink href={REPO_ISSUES}>Report it on GitHub</ExtLink>.</p>
        </div>
      </Container>
    </>
  )
}
