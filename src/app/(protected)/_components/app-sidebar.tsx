import {
  BriefcaseMedical,
  CalendarPlus2,
  LayoutDashboard,
  UsersIcon,
} from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/_components/ui/sidebar'
import { auth } from '@/_lib/auth'

import { SignOutTooltipButton } from './sign-out-tooltip-button'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '#',
    icon: LayoutDashboard,
  },
  {
    title: 'Agendamentos',
    url: '/appointments',
    icon: CalendarPlus2,
  },
  {
    title: 'Médicos',
    url: '/doctors',
    icon: BriefcaseMedical,
  },
  {
    title: 'Pacientes',
    url: '/patients',
    icon: UsersIcon,
  },
]

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }

  const [firstName, ...restOfName] = session.user.name.split(' ')
  const firstLetterOfFirstName = firstName[0]
  const firstLetterOfLastName = restOfName[restOfName.length - 1][0]

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Image
          src="/logo.svg"
          alt="Doutor Agenda"
          width={136.5198974609375}
          height={27.79203987121582}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-3">
            <div className="bg-muted-foreground/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
              <span>{firstLetterOfFirstName}</span>
              <span>{firstLetterOfLastName}</span>
            </div>

            <div className="w-full font-medium">
              <p className="text-sm">{session.user.name}</p>
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
