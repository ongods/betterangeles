import { useRef, useState } from 'react';
import { Menu, X, CheckCircle2 } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { mainNavigation } from '../../data/navigation';
import { site } from '../../data/site';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <a href="#page-content" className="skip-link">
        Skip to content
      </a>
      <div className="container mx-auto px-4 flex items-center justify-between gap-5 py-4">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 shrink-0 no-underline"
        >
          <CheckCircle2
            className="h-9 w-9 text-primary-700"
            aria-hidden="true"
          />
          <span>
            <span className="block font-bold text-gray-900">{site.name}</span>
            <span className="block text-xs text-gray-700">
              A community guide to Angeles City
            </span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-6"
        >
          {mainNavigation.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold text-primary-700 underline underline-offset-8'
                  : 'font-medium text-gray-800 hover:text-primary-700 no-underline'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          ref={menuButton}
          type="button"
          className="xl:hidden rounded-md p-3 text-gray-900"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="xl:hidden border-t border-gray-200 container mx-auto px-4 pb-4"
          onKeyDown={event => {
            if (event.key === 'Escape') {
              setOpen(false);
              menuButton.current?.focus();
            }
          }}
        >
          {mainNavigation.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-medium text-gray-900"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
