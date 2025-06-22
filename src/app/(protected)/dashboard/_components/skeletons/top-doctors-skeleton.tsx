import { StethoscopeIcon } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback } from '@/_components/ui/avatar'
import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { ScrollArea } from '@/_components/ui/scroll-area'
import { Separator } from '@/_components/ui/separator'

export function TopDoctorsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StethoscopeIcon size={16} />
          <CardTitle>Médicos</CardTitle>
        </div>

        <Button
          variant="link"
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <Link href="/doctors">Ver todos</Link>
        </Button>
      </CardHeader>

      <div className="px-6">
        <Separator />
      </div>

      <CardContent>
        <ScrollArea
          className="h-[264px] [&_[data-slot='scroll-area-scrollbar']]:translate-x-2"
          type="always"
        >
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14">
                    <AvatarFallback className="font-semibold">
                      <div className="h-4 w-8 animate-pulse rounded-md bg-gray-200" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <div className="h-6 w-3xs animate-pulse rounded-md bg-gray-200" />
                    <div className="h-4 w-2xs animate-pulse rounded-md bg-gray-200" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="h-4 w-21 animate-pulse rounded-md bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
