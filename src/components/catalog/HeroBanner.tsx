import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { nftImageProps } from '@/lib/images'
import { scrollToCatalog } from './scrollToCatalog'

export function HeroBanner() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden rounded-3xl bg-card md:mt-8 md:rounded-[30px]">
      <div className="pointer-events-none absolute -top-24 left-1/3 size-[420px] rounded-full bg-surface-dark/60 md:hidden" aria-hidden="true" />
      <div className="relative grid items-center gap-4 p-4 md:grid-cols-[1fr_450px] md:gap-10 md:p-0 md:pl-10">
        <div className="flex flex-col gap-3 md:gap-6 md:py-11">
          <p className="text-xs font-bold md:text-sm">Bem-vindo à Kurio</p>
          <h1 id="hero-title" className="max-w-[220px] text-lg leading-8 font-bold md:max-w-none md:text-[43px] md:leading-[70px]">
            <span className="md:hidden">SEJA DONO DA CULTURA DIGITAL</span>
            <span className="hidden md:inline">
              SEJA DONO DO FUTURO
              <br />
              DA ARTE DIGITAL
            </span>
          </h1>
          <p className="max-w-[200px] text-xs leading-5 text-muted-foreground md:max-w-[557px] md:text-sm md:leading-6">
            Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
          </p>
          <Button onClick={scrollToCatalog} className="w-fit md:h-10 md:w-[140px]" size="default">
            EXPLORAR
            <ArrowRight className="md:hidden" aria-hidden="true" />
          </Button>
        </div>
        <img
          {...nftImageProps('emerald-ape', '(min-width: 768px) 450px, 140px')}
          alt="Emerald Ape #042, destaque da coleção Kurio Apes"
          fetchPriority="high"
          className="absolute top-4 right-4 aspect-square w-[140px] rounded-2xl object-cover md:static md:w-[450px] md:rounded-[30px]"
        />
      </div>
      <div className="flex justify-center gap-2 pb-4 md:absolute md:bottom-11 md:left-[600px] md:pb-0" aria-hidden="true">
        <span className="size-2 rounded-full bg-primary" />
        <span className="size-2 rounded-full bg-primary/60" />
        <span className="size-2 rounded-full bg-primary/60" />
      </div>
    </section>
  )
}
