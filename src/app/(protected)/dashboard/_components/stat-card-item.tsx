import type { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/_components/ui/card'

interface StatCardItemProps {
  icon: LucideIcon
  label: string
  value: string | number
  formatter?: (value: string | number) => string
}

export function StatCardItem({
  icon: Icon,
  label,
  value,
  formatter,
}: StatCardItemProps) {
  return (
    <Card className="gap-2">
      <CardHeader className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
          <Icon size={16} />
        </div>
        <h3 className="text-muted-foreground text-sm font-semibold">{label}</h3>
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold">
          {formatter ? formatter(value) : value}
        </p>
      </CardContent>
    </Card>
  )
}
