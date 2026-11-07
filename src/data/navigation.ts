import type { NavigationItem } from '../types';

export const mainNavigation: NavigationItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'About Angeles', href: '/about' },
  { label: 'Directory', href: '/directory' },
  { label: 'Government', href: '/government/departments' },
  { label: 'Transparency', href: '/transparency' },
  { label: 'Contact & Help', href: '/contact' },
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'Explore',
      links: [
        { label: 'Service guides', href: '/services' },
        { label: 'City directory', href: '/directory' },
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
