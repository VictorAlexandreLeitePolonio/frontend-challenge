import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { nftImageProps } from '@/lib/images'
import { scrollToCatalog } from './scrollToCatalog'

const PROMOS = [
  {
    id: 'genesis',
    image: 'emerald-ape' as const,
    title: 'Lançamentos gênesis de edição limitada',
    description: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
  },
  {
    id: 'curated',
    image: 'ivory-baron' as const,
    title: 'Arte digital selecionada e muito mais',
    description: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
  },
]

export function CatalogPromos() {
  return (
    <section aria-labelledby="promos-title" className="mt-16 md:mt-24">
      <h2 id="promos-title" className="sr-only">
        Promoções
      </h2>
      <div className="grid gap-7 sm:grid-cols-2">
        {PROMOS.map((promo) => (
          <article key={promo.id} className="flex overflow-hidden bg-card">
            <img
              {...nftImageProps(promo.image, '(min-width: 640px) 290px, 40vw')}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-[38%] shrink-0 object-cover sm:w-[49%]"
            />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center sm:p-6">
              <h3 className="text-sm leading-5 font-bold md:text-base">{promo.title}</h3>
              <p className="text-xs leading-5 text-muted-foreground md:text-sm md:leading-6">{promo.description}</p>
              <Button size="sm" onClick={scrollToCatalog} aria-label={`Explorar: ${promo.title}`}>
                Explorar
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
