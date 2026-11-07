export function getPhilippineDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Manila',
  }).format(now);
}

export function getEventStatus(
  start: string,
  end: string,
  now = new Date()
): string {
  const today = getPhilippineDate(now);
  if (today > end) return 'Past event';
  if (today < start) return 'Upcoming event';
  return 'Scheduled today';
}
