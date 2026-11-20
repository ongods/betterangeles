// Single navigation model shared by the header, mobile menu, section tabs and footer.
export type NavItem = { to: string; label: string; match?: string[]; children?: [string, string][] }
export const NAV: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Angeles', match: ['/about', '/culture'], children: [['/about', 'City profile'], ['/culture', 'Culture & Events']] },
  { to: '/services', label: 'Services' },
  { to: '/government', label: 'Government', match: ['/government', '/directory'], children: [['/government', 'Overview'], ['/directory', 'City Directory'], ['/government/barangays', 'Barangays']] },
  { to: '/transparency', label: 'Transparency' },
  { to: '/map', label: 'Interactive Map' },
  { to: '/contact', label: 'Contact & Help', match: ['/contact', '/accessibility'], children: [['/contact', 'Contact & Help'], ['/accessibility', 'Accessibility']] },
]
export const under = (path: string, base: string) => base === '/' ? path === '/' : path === base || path.startsWith(base + '/')
export const isActive = (path: string, n: NavItem) => (n.match ?? [n.to]).some((b) => under(path, b))
/** Child tab that best matches the path (longest prefix wins, so /government/barangays beats /government). */
export const activeChild = (path: string, n: NavItem) =>
  (n.children ?? []).filter(([to]) => under(path, to)).sort((a, b) => b[0].length - a[0].length)[0]?.[0]
export const sectionFor = (path: string) => NAV.find((n) => n.children && isActive(path, n))
