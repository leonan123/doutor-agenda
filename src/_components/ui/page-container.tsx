import type { ReactNode } from 'react'

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div data-slot="page-container" className="space-y-6 p-6">
      {children}
    </div>
  )
}

export function PageHeader({ children }: { children: ReactNode }) {
  return (
    <div data-slot="page-header" className="flex items-center justify-between">
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

export function PageContent({ children }: { children: ReactNode }) {
  return (
    <div data-slot="page-content" className="space-y-6">
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
