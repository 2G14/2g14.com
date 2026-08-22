export function replaceUrlQuery(queryString: string): void {
  const url = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
  history.replaceState(null, '', url);
}
