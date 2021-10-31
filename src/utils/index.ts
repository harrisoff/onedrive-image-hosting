export function parseHash(hash: string): { [key: string]: string } {
  if (hash && hash.startsWith('#')) {
    hash = hash.slice(1);
    return Object.fromEntries(hash
      .split('&')
      .map(item => item.split('='))
      .filter(item => item.length === 2)
    )
  }
  return {}
}
