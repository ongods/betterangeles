import { Link } from 'react-router-dom';
import { footerNavigation } from '../../data/navigation';
import { site } from '../../data/site';

export default function Footer() {
  return (
    <footer className="dark-surface bg-primary-900 text-white">
      <div className="civic-container py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-semibold text-lg mb-3">{site.name}</p>
            <p className="text-primary-100 max-w-sm">
              {site.description} Source dates and known gaps are shown
              throughout the guide.
            </p>
            <a
              className="inline-block mt-4 text-white underline"
              href={site.officialUrl}
            >
              Official Angeles City website
            </a>
          </div>
          {footerNavigation.mainSections.map(section => (
            <div key={section.title}>
              <p className="font-semibold mb-3">{section.title}</p>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.href}>
                    {link.href.startsWith('https:') ? (
                      <a className="text-white underline" href={link.href}>
                        {link.label}
                      </a>
                    ) : (
                      <Link className="text-white underline" to={link.href}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="border-t border-primary-800 mt-8 pt-5 text-sm text-primary-100">
          A community project. Government transactions take place on official
          systems. Source materials retain their own terms. Built on{' '}
          <a
            href="https://github.com/iyanski/betterlocalgov"
            className="underline"
          >
            BetterLocalGov
          </a>
          . Project code:{' '}
          <a
            href="https://github.com/ongods/betterangeles/blob/main/LICENSE"
            className="underline"
          >
            CC0 1.0
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
