import { Skeleton } from '@/components/ui/skeleton'

export function NftDetailSkeleton() {
  return (
    <div role="status" aria-label="Carregando NFT" className="flex flex-col gap-8">
      <span className="sr-only">Carregando NFT…</span>
      <Skeleton className="h-4 w-36" aria-hidden="true" />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="hidden gap-7 md:grid md:grid-cols-[100px_minmax(0,1fr)]" aria-hidden="true">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </div>

        <div className="md:hidden" aria-hidden="true">
          <Skeleton className="aspect-[361/356] w-full rounded-2xl" />
        </div>

        <div className="flex flex-col gap-5" aria-hidden="true">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-28" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-16 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-32" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-[130px]" />
            <Skeleton className="h-10 w-[130px]" />
          </div>
          <div className="flex flex-col gap-2 pt-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  )
}
