import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Heart, Loader2 } from 'lucide-react'
import { nftImageProps } from '@/lib/images'
import { cn } from '@/lib/utils'
import type { Nft } from '@/schemas/nft'

interface NftMobileHeroProps {
  nft: Nft
  favorite: boolean
  favoritePending: boolean
  favoriteDisabled: boolean
  onToggleFavorite: () => void
}

export function NftMobileHero({ nft, favorite, favoritePending, favoriteDisabled, onToggleFavorite }: NftMobileHeroProps) {
  const gallery = nft.gallery.length > 0 ? nft.gallery : [nft.image]
  const [active, setActive] = useState(0)
  const current = gallery[Math.min(active, gallery.length - 1)] ?? nft.image

  return (
    <div className="-mx-4 bg-card px-4 pt-4 pb-12 md:hidden">
      <div className="relative">
        <img
          {...nftImageProps(current, '90vw')}
          alt={`Arte do NFT ${nft.name}, imagem ${active + 1} de ${gallery.length}`}
          fetchPriority="high"
          className="aspect-[361/356] w-full rounded-2xl object-cover"
        />
        <Link
          to="/"
          aria-label="Voltar ao catálogo"
          className="absolute top-3 left-3 grid size-9 place-items-center rounded-full border border-border-soft bg-background/80 text-foreground backdrop-blur"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={favoriteDisabled || favoritePending}
          aria-pressed={favorite}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-busy={favoritePending}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-border-soft bg-background/80 text-primary backdrop-blur disabled:opacity-60"
        >
          {favoritePending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Heart className={cn('size-4', favorite && 'fill-primary')} aria-hidden="true" />
          )}
        </button>
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagem ${index + 1} de ${gallery.length}`}
              aria-pressed={index === active}
              className={cn(
                'h-2.5 rounded-full border border-primary transition-all',
                index === active ? 'w-5 bg-primary' : 'w-2.5 bg-transparent',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
