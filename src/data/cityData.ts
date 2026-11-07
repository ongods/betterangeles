import data from './angeles.json';

export const cityData = data;

export function getSource(id: string) {
  return data.sources[id as keyof typeof data.sources];
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-PH').format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  }).format(new Date(value.length === 10 ? `${value}T00:00:00+08:00` : value));
}
