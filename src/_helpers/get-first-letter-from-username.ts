export function extractInitialsFromUsername(username: string) {
  const names = username.trim().split(' ')
  return (names[0]?.[0] ?? '') + (names[names.length - 1]?.[0] ?? '')
}
