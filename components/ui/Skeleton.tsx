// components/ui/Skeleton.tsx
import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-gray-200', className)} />
}

export function DashboardSkeleton() {
  return (
    <div className="p-8">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="col-span-2 h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}

export function TaskListSkeleton() {
  return (
    <div className="p-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
      </div>
    </div>
  )
}
