import { SidebarProvider, SidebarTrigger } from '@/_components/ui/sidebar'

import { AppSidebar } from './_components/app-sidebar'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="bg-background w-full">
        <SidebarTrigger className="ml-4" />
        <div className="h-[calc(100%-7rem)]">{children}</div>
      </main>
    </SidebarProvider>
  )
}
