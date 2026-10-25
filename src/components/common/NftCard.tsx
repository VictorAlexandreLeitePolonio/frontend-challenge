import { Link } from '@tanstack/react-router'
import { nftImageProps } from '@/lib/images'
import { cn } from '@/lib/utils'
import type { NftSummary } from '@/schemas/nft'
import { EthPrice } from './EthPrice'

interface NftCardProps {
  nft: NftSummary
  /** Primeira dobra: carrega com prioridade (LCP). */
  priority?: boolean
  className?: string
  /** Ações extras sobre a imagem (ex.: favoritar). */
  actions?: React.ReactNode
}

export function NftCard({ nft, priority = false, className, actions }: NftCardProps) {
  return (
    <article className={cn('group relative flex flex-col gap-3', className)}>
      <div className="relative overflow-hidden rounded-sm bg-card p-3">
        <img
          {...nftImageProps(nft.image)}
          alt={`Arte do NFT ${nft.name}`}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="aspect-square w-full rounded-2xl object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
        />
        {nft.badge && (
          <span className="absolute top-3 left-3 bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">{nft.badge}</span>
        )}
        {nft.available === 0 && (
          <span className="absolute top-3 right-3 bg-background/90 px-2 py-1 text-xs font-bold text-foreground">Esgotado</span>
        )}
        {actions && <div className="absolute right-3 bottom-3 flex gap-2">{actions}</div>}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">
          <Link
            to="/nft/$nftId"
            params={{ nftId: nft.id }}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ring"
          >
            {nft.name}
          </Link>
        </h3>
        <EthPrice value={nft.price} previous={nft.compareAtPrice} className="text-base" />
      </div>
    </article>
  )
}
