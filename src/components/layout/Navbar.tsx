import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Landmark, Menu, Search, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { mainNavigation, currentSection } from '../../data/navigation';
import { site } from '../../data/site';

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const active = currentSection(pathname);
  useEffect(() => {
    if (!open) return;
    nav.current?.querySelector('a')?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 80rem)');
    const resize = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener('keydown', close);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('keydown', close);
      desktop.removeEventListener('change', resize);
    };
  }, [open]);
  const links = mainNavigation.map(item => (
    <Link
      key={item.href}
      to={item.href}
      onClick={() => setOpen(false)}
      aria-current={
        pathname === item.href
          ? 'page'
          : active === item
            ? 'location'
            : undefined
      }
      className="civic-nav-link"
    >
      {item.label}
    </Link>
  ));
  return (
    <>
      <a href="#page-content" className="skip-link">
        Skip to content
      </a>
      <div className="dark-surface bg-primary-900 text-primary-100">
        <div className="civic-container flex min-h-9 items-center justify-between gap-4 py-2 text-xs">
          <span>A community guide to Angeles City, Pampanga</span>
          <a
            className="inline-flex items-center gap-1 underline"
            href={site.officialUrl}
          >
            Official city website
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </div>
      </div>
      <header
        className="dark-surface sticky top-0 z-50 border-b border-white/15 bg-primary-800 text-white"
        onBlur={event => {
          if (
            event.relatedTarget &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            setOpen(false);
        }}
      >
        <div className="civic-container flex min-h-16 items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-bold"
            onClick={() => setOpen(false)}
          >
            <Landmark
              className="size-9 rounded-lg bg-primary-500 p-2"
              aria-hidden="true"
            />
            {site.name}
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden items-center xl:flex"
          >
            {links}
          </nav>
          <div className="flex items-center">
            <Link
              aria-label="Search service guides"
              to="/services#service-query"
              onClick={() => setOpen(false)}
              className="rounded-md p-3 hover:bg-white/10"
            >
              <Search className="size-5" aria-hidden="true" />
            </Link>
            <button
              ref={toggle}
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1 rounded-md p-2 xl:hidden"
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}{' '}
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
        {open && (
          <>
            <div
              className="absolute inset-x-0 top-full h-[100dvh] bg-primary-900/40 xl:hidden"
              aria-hidden="true"
              onClick={() => setOpen(false)}
            />
            <nav
              id="mobile-navigation"
              ref={nav}
              aria-label="Mobile navigation"
              className="absolute inset-x-0 top-full max-h-[75dvh] overflow-auto border-t border-white/20 bg-primary-800 py-2 shadow-lg xl:hidden"
            >
              <div className="civic-container grid">{links}</div>
            </nav>
          </>
        )}
      </header>
      {active?.children && (
        <nav
          aria-label={active.label + ' sections'}
          className="border-b border-gray-200 bg-gray-50"
        >
          <div className="civic-container flex flex-wrap gap-x-4">
            {active.children.map(child => (
              <Link
                key={child.href}
                to={child.href}
                aria-current={pathname === child.href ? 'page' : undefined}
                className="py-3 text-sm font-semibold text-primary-700 underline-offset-4 hover:underline aria-[current=page]:underline"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
