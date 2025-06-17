import type { authClient } from '@/_lib/auth-client'

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      ptBr: string
    }
  >
>

const errorCodes = {
  USER_ALREADY_EXISTS: {
    ptBr: 'Email já cadastrado.',
  },
  USER_NOT_FOUND: {
    ptBr: 'O usuário não foi encontrado.',
  },
  INVALID_EMAIL_OR_PASSWORD: {
    ptBr: 'Email ou senha inválidos.',
  },
  INVALID_PASSWORD: {
    ptBr: 'Email ou senha inválidos.',
  },
  INVALID_EMAIL: {
    ptBr: 'Email ou senha inválidos.',
  },
} satisfies ErrorTypes

export function getAuthErrorMessage(code: string, lang: 'ptBr') {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang]
  }

  return ''
}
