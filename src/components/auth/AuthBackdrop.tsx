import { HeroBanner } from '@/components/catalog/HeroBanner'
import { NftCard } from '@/components/common/NftCard'
import { NftCardSkeleton } from '@/components/common/NftCardSkeleton'
import { PageContainer } from '@/components/layout/PageContainer'
import { useNfts } from '@/hooks/useNfts'

/**
 * Página atrás do diálogo em /login e /signup: hero e cards do catálogo, inertes.
 * Só desktop; no mobile a tela de auth ocupa tudo.
 */
export function AuthBackdrop() {
  const query = useNfts({ pageSize: 9 })

  return (
    <div aria-hidden="true" inert className="hidden pb-10 md:block">
      <PageContainer>
        <HeroBanner />
        <div className="mt-24 grid grid-cols-3 gap-x-8 gap-y-12">
          {query.data
            ? query.data.items.map((nft, index) => <NftCard key={nft.id} nft={nft} priority={index < 3} />)
            : Array.from({ length: 9 }, (_, index) => <NftCardSkeleton key={index} />)}
        </div>
      </PageContainer>
    </div>
  )
}
