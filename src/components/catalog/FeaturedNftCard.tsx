import { Link } from '@tanstack/react-router'
import { nftImageProps } from '@/lib/images'
import type { NftSummary } from '@/schemas/nft'

interface FeaturedNftCardProps {
  nft: NftSummary
}

export function FeaturedNftCard({ nft }: FeaturedNftCardProps) {
  return (
    <aside aria-labelledby="featured-title" className="bg-card p-5">
      <p id="featured-title" className="text-base font-bold tracking-wide text-accent-text">
        NFT EM DESTAQUE
      </p>
      <p className="mt-2 text-sm font-bold tracking-wide">OFERTA LIMITADA</p>
      <Link
        to="/nft/$nftId"
        params={{ nftId: nft.id }}
        aria-label={`Ver ${nft.name} em destaque`}
        className="mt-5 block overflow-hidden rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
      >
        <img
          {...nftImageProps(nft.image, '(min-width: 1024px) 270px, 60vw')}
          alt={`Arte do NFT ${nft.name}`}
          loading="lazy"
          decoding="async"
          className="aspect-[310/368] w-full rounded-sm object-cover transition-transform duration-300 motion-safe:hover:scale-[1.02]"
        />
      </Link>
    </aside>
  )
}
