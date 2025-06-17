export function getFirstLetterFromUsername(username: string) {
  const [firstName, ...restOfName] = username.split(' ')
  const firstLetterOfFirstName = firstName[0]
  let firstLetterOfLastName = ''

  if (restOfName.length > 0) {
    firstLetterOfLastName = restOfName[restOfName.length - 1][0]
  }

  return firstLetterOfFirstName + firstLetterOfLastName
}
