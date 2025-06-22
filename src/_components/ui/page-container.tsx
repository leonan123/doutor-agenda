import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/_lib/utils'

type PageContainerProps = ComponentProps<'div'>

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      data-slot="page-container"
      className={cn('h-full space-y-6 p-6', className)}
    >
      {children}
    </div>
  )
}

export function PageHeader({ children, className }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        'flex flex-col justify-between gap-4 md:flex-row md:items-center',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PageHeaderContent({ children }: { children: ReactNode }) {
  return (
    <div data-slot="page-header-content" className="space-y-1">
      {children}
    </div>
  )
}

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 data-slot="page-title" className="text-2xl font-bold">
      {children}
    </h1>
  )
}

export function PageDescription({ children }: { children: ReactNode }) {
  return (
    <p data-slot="page-description" className="text-muted-foreground text-sm">
      {children}
    </p>
  )
}

export function PageActions({ children }: { children: ReactNode }) {
  return (
    <div data-slot="page-actions" className="flex items-center gap-2">
      {children}
    </div>
  )
}

type PageContentProps = ComponentProps<'div'>

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div data-slot="page-content" className={cn('space-y-6', className)}>
      {children}
    </div>
  )
}

export function PageFooter({ children }: { children: ReactNode }) {
  return (
    <div data-slot="page-footer" className="flex items-center justify-end">
      {children}
    </div>
  )
}
