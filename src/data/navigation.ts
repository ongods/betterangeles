import type { NavigationItem } from '../types';

export const mainNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About Angeles',
    href: '/about',
    children: [
      { href: '/about', label: 'City profile' },
      { href: '/culture', label: 'Culture & events' },
    ],
  },
  { label: 'Services', href: '/services' },
  {
    label: 'Government',
    href: '/government',
    children: [
      { href: '/government', label: 'Overview' },
      { href: '/government/departments', label: 'Departments' },
      { href: '/government/barangays', label: 'Barangays' },
      { href: '/directory', label: 'City directory' },
    ],
  },
  { label: 'Transparency', href: '/transparency' },
  { label: 'Interactive Map', href: '/map' },
  {
    label: 'Contact & Help',
    href: '/contact',
    children: [
      { href: '/contact', label: 'Contact & Help' },
      { href: '/accessibility', label: 'Accessibility' },
    ],
  },
];

export function currentSection(pathname: string) {
  const path = pathname === '/search' ? '/services' : pathname;
  const includes = (href: string) =>
    path === href || (href !== '/' && path.startsWith(href + '/'));
  return mainNavigation.find(
    item =>
      includes(item.href) || item.children?.some(child => includes(child.href))
  );
}

export const footerNavigation = {
  mainSections: [
    {
      title: 'Government',
      links: [
        { label: 'Departments and offices', href: '/government/departments' },
        { label: 'Barangays', href: '/government/barangays' },
        { label: 'Transparency records', href: '/transparency' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'Service guides', href: '/services' },
        { label: 'City directory', href: '/directory' },
        { label: 'Interactive map', href: '/map' },
        { label: 'Culture and events', href: '/culture' },
      ],
    },
    {
      title: 'About this guide',
      links: [
        { label: 'Contact & Help', href: '/contact' },
        { label: 'Accessibility', href: '/accessibility' },
        {
          label: 'Project repository',
          href: 'https://github.com/ongods/betterangeles',
        },
      ],
    },
  ],
};
