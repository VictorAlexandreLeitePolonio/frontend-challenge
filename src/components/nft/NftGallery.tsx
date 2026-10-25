import { useId, useState } from 'react'
import { nftImageProps } from '@/lib/images'
import { cn } from '@/lib/utils'
import type { Nft } from '@/schemas/nft'

interface NftGalleryProps {
  nft: Nft
}

export function NftGallery({ nft }: NftGalleryProps) {
  const hintId = useId()
  const gallery = nft.gallery.length > 0 ? nft.gallery : [nft.image]
  const [active, setActive] = useState(0)
  const current = gallery[Math.min(active, gallery.length - 1)] ?? nft.image

  const move = (delta: number) => {
    setActive((currentIndex) => (currentIndex + delta + gallery.length) % gallery.length)
  }

  return (
    <section
      aria-label="Galeria do NFT"
      aria-roledescription="galeria de imagens"
      aria-describedby={hintId}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          move(-1)
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          move(1)
        }
      }}
      className="hidden gap-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:grid md:grid-cols-[100px_minmax(0,1fr)]"
    >
      <p id={hintId} className="sr-only">
        Use as setas esquerda e direita para trocar a imagem.
      </p>
      <div className="flex flex-col gap-4">
        {gallery.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            aria-pressed={index === active}
            aria-label={`Ver imagem ${index + 1} de ${gallery.length}`}
            onClick={() => setActive(index)}
            className={cn(
              'overflow-hidden rounded-lg border-2 transition-colors',
              index === active ? 'border-primary' : 'border-transparent hover:border-border-soft',
            )}
          >
            <img
              {...nftImageProps(image, '100px')}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card p-5">
        <img
          {...nftImageProps(current, '(min-width: 1024px) 404px, 40vw')}
          alt={`Arte do NFT ${nft.name}, imagem ${active + 1} de ${gallery.length}`}
          fetchPriority="high"
          className="aspect-square w-full rounded-2xl object-cover"
        />
      </div>
    </section>
  )
}
