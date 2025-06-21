'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/_components/ui/button'
import { authClient } from '@/_lib/auth-client'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/authentication')
        },
      },
    })
  }

  return <Button onClick={handleSignOut}>Sair</Button>
}
