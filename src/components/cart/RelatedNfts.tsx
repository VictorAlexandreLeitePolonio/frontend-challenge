import { ErrorState } from '@/components/common/ErrorState'
import { NftCard } from '@/components/common/NftCard'
import { NftCardSkeleton } from '@/components/common/NftCardSkeleton'
import { useNfts } from '@/hooks/useNfts'

export function RelatedNfts() {
  const query = useNfts({ pageSize: 5 })

  return (
    <section aria-labelledby="related-heading" className="mt-14">
      <h2 id="related-heading" className="border-b border-border pb-3 text-base font-bold">
        Colecionadores também viram
      </h2>

      <div className="mt-6">
        {query.isPending && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <NftCardSkeleton key={index} />
            ))}
          </div>
        )}
        {query.isError && (
          <ErrorState
            error={query.error}
            title="Não foi possível carregar os relacionados"
            onRetry={() => void query.refetch()}
            isRetrying={query.isFetching}
          />
        )}
        {query.isSuccess && query.data.items.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum NFT disponível no momento.</p>
        )}
        {query.isSuccess && query.data.items.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {query.data.items.map((nft) => (
              <li key={nft.id}>
                <NftCard nft={nft} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
