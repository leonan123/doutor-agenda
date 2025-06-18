export function extractInitialsFromUsername(username: string) {
  const names = username.trim().split(' ')

  const nameInitials =
    (names[0]?.[0] ?? '') + (names[names.length - 1]?.[0] ?? '')

  return nameInitials.toUpperCase()
}
