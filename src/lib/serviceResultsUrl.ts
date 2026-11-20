export function serviceResultsUrl(state: unknown): string | null {
  if (!state || typeof state !== 'object' || !('serviceResults' in state))
    return null;
  const result = state.serviceResults;
  if (
    !result ||
    typeof result !== 'object' ||
    !('path' in result) ||
    !('search' in result)
  )
    return null;
  if (
    typeof result.path !== 'string' ||
    !/^\/services(?:\/[a-z0-9-]+)?$/.test(result.path) ||
    typeof result.search !== 'string'
  )
    return null;
  const query = new URLSearchParams(result.search).toString();
  return query ? result.path + '?' + query : result.path;
}
