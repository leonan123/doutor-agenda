import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/_components/ui/sidebar'
import { extractInitialsFromUsername } from '@/_helpers/get-first-letter-from-username'
import { auth } from '@/_lib/auth'

import { MainMenu } from './menu-item'
import { SignOutTooltipButton } from './sign-out-tooltip-button'

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }

  const firstLettersOfUsername = extractInitialsFromUsername(session.user.name)

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Image
          src="/logo.svg"
          alt="Doutor Agenda"
          width={136.5198974609375}
          height={27.79203987121582}
          priority
        />
      </SidebarHeader>

      <SidebarContent>
        <MainMenu />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-3">
            <div className="bg-muted-foreground/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
              <span>{firstLettersOfUsername}</span>
            </div>

            <div className="w-full truncate font-medium">
              <p className="truncate text-sm">{session.user.clinic.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {session.user.email}
              </p>
            </div>
            <SignOutTooltipButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
