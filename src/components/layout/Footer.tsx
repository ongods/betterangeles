import { Link } from 'react-router-dom';
import { footerNavigation } from '../../data/navigation';
import { site } from '../../data/site';

export default function Footer() {
  return (
    <footer className="dark-surface bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-semibold text-lg mb-3">{site.name}</p>
            <p className="text-gray-200 max-w-sm">
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
        <p className="border-t border-gray-700 mt-8 pt-5 text-sm text-gray-200">
          A community project. Government transactions take place on official
          systems. Source materials retain their own terms.
        </p>
      </div>
    </footer>
  );
}
