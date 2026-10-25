import { Skeleton } from '@/components/ui/skeleton'

export function CartSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Carregando carrinho…
      </p>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_332px] xl:gap-x-[86px]" aria-hidden="true">
        <div>
          <div className="hidden grid-cols-[minmax(0,1fr)_100px_150px_120px_40px] gap-4 border-b border-border pb-3 md:grid">
            {['NFTs', 'Preço', 'Edições', 'Total'].map((label) => (
              <span key={label} className="text-sm text-muted-foreground">
                {label}
              </span>
            ))}
            <span />
          </div>
          <ul className="mt-4 flex flex-col gap-3 md:gap-0">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index} className="rounded-sm border border-border p-3 md:border-0 md:border-b md:p-0 md:py-4">
                <div className="flex items-center gap-3 md:grid md:grid-cols-[minmax(0,1fr)_100px_150px_120px_40px] md:gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Skeleton className="size-20 shrink-0 rounded-sm md:size-[70px]" />
                    <div className="flex w-full max-w-56 flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                  </div>
                  <Skeleton className="hidden h-4 w-20 md:block" />
                  <Skeleton className="hidden h-6 w-28 md:block" />
                  <Skeleton className="hidden h-4 w-20 md:block" />
                  <Skeleton className="hidden size-8 md:block" />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-6 rounded-2xl bg-card p-4 md:rounded-none md:bg-transparent md:p-0">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="h-12 w-full rounded-full md:h-10 md:rounded-sm" />
        </div>
      </div>
    </div>
  )
}
