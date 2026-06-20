'use client'

import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-700/50', className)} />
}

export function SkeletonCard() {
  return (
    <div className="space-y-4 p-4 bg-slate-800/50 rounded-xl">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">جاري التحميل...</p>
      </div>
    </div>
  )
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel 
}: { 
  icon?: any
  title: string
  description?: string
  action?: () => void
  actionLabel?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <Icon className="w-10 h-10 text-slate-600" />
        </div>
      )}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-slate-400 mb-4 max-w-sm">{description}</p>
      )}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
