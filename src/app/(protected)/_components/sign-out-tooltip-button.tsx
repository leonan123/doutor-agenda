'use client'

import { Loader2Icon, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { Button } from '@/_components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/_components/ui/tooltip'
import { authClient } from '@/_lib/auth-client'

export function SignOutTooltipButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/authentication')
          },
        },
      })
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild className="shrink-0">
        <Button size="icon" variant="ghost" onClick={handleSignOut}>
          {isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <LogOutIcon />
          )}
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>Sair</span>
      </TooltipContent>
    </Tooltip>
  )
}
