import { Skeleton } from '@/components/ui/skeleton'

/** Mesmas proporções do NftCard para não deslocar o layout quando os dados chegam. */
export function NftCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="rounded-sm bg-card p-3">
        <Skeleton className="aspect-square w-full rounded-2xl" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}
