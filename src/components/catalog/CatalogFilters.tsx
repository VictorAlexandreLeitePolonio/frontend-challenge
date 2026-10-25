import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { formatEth, fromWei, toWei } from '@/lib/eth'
import { cn } from '@/lib/utils'
import { collectionIdSchema, type CollectionId, type NftListResponse } from '@/schemas/nft'
import { networkSchema, type Network } from '@/schemas/common'
import { CatalogSort } from './CatalogSort'
import { toggleValue, useCatalogSearch } from './useCatalogSearch'

const STEPS = 1000

function stepFromPrice(price: string | undefined, min: string, max: string, fallback: number) {
  if (!price) return fallback
  const low = toWei(min)
  const high = toWei(max)
  if (high <= low) return fallback
  const value = toWei(price)
  if (value <= low) return 0
  if (value >= high) return STEPS
  return Number(((value - low) * BigInt(STEPS)) / (high - low))
}

function priceAtStep(min: string, max: string, step: number) {
  const low = toWei(min)
  const high = toWei(max)
  if (high <= low) return min
  return fromWei(low + ((high - low) * BigInt(step)) / BigInt(STEPS))
}

interface FilterItemProps {
  label: string
  count: number
  active: boolean
  onToggle: () => void
}

function FilterItem({ label, count, active, onToggle }: FilterItemProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={count === 0 && !active}
      onClick={onToggle}
      className={cn(
        'flex w-full items-baseline justify-between gap-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40',
        active && 'font-bold text-accent-text underline decoration-primary underline-offset-4 hover:text-accent-text',
      )}
    >
      <span>{label}</span>
      <span aria-hidden="true">({count})</span>
      <span className="sr-only">{count} itens</span>
    </button>
  )
}

interface PriceRangeFilterProps {
  min: string
  max: string
}

function PriceRangeFilter({ min, max }: PriceRangeFilterProps) {
  const { search, update } = useCatalogSearch()
  const [range, setRange] = useState<[number, number]>(() => [
    stepFromPrice(search.minPrice, min, max, 0),
    stepFromPrice(search.maxPrice, min, max, STEPS),
  ])

  const lowPrice = priceAtStep(min, max, range[0])
  const highPrice = priceAtStep(min, max, range[1])

  return (
    <div className="flex flex-col gap-4">
      <Slider
        min={0}
        max={STEPS}
        step={1}
        value={range}
        onValueChange={(values) => setRange([values[0] ?? 0, values[1] ?? STEPS])}
        thumbLabels={['Preço mínimo', 'Preço máximo']}
        aria-label="Faixa de preço"
      />
      <p className="text-xs text-muted-foreground">
        Preço: {formatEth(lowPrice)} – {formatEth(highPrice)}
      </p>
      <Button
        size="sm"
        className="w-fit px-3"
        onClick={() =>
          update({
            minPrice: range[0] > 0 ? lowPrice : undefined,
            maxPrice: range[1] < STEPS ? highPrice : undefined,
          })
        }
      >
        Aplicar
      </Button>
    </div>
  )
}

interface CatalogFiltersProps {
  facets: NftListResponse['facets']
  showSort?: boolean
}

export function CatalogFilters({ facets, showSort = false }: CatalogFiltersProps) {
  const { search, update, reset } = useCatalogSearch()
  const id = useId()
  const collections = search.collections ?? []
  const networks = search.networks ?? []
  const activeFilters = collections.length + networks.length + (search.minPrice || search.maxPrice ? 1 : 0)

  const toggleCollection = (id: CollectionId) => {
    const next = toggleValue(collections, id)
    update({ collections: next.length > 0 ? next : undefined })
  }

  const toggleNetwork = (id: Network) => {
    const next = toggleValue(networks, id)
    update({ networks: next.length > 0 ? next : undefined })
  }

  return (
    <div className="flex flex-col gap-8">
      {showSort && (
        <section aria-labelledby={`${id}-sort`}>
          <h3 id={`${id}-sort`} className="mb-3 text-base font-normal">
            Ordenar por
          </h3>
          <CatalogSort
            value={search.sort ?? 'recent'}
            onChange={(sort) => update({ sort: sort === 'recent' ? undefined : sort })}
            className="justify-between"
          />
        </section>
      )}

      <section aria-labelledby={`${id}-collections`} className="flex flex-col gap-3">
        <h3 id={`${id}-collections`} className="text-base font-bold">
          Coleções
        </h3>
        {facets.collections.map((facet) => {
          const parsed = collectionIdSchema.safeParse(facet.id)
          if (!parsed.success) return null
          return (
            <FilterItem
              key={facet.id}
              label={facet.label}
              count={facet.count}
              active={collections.includes(parsed.data)}
              onToggle={() => toggleCollection(parsed.data)}
            />
          )
        })}
      </section>

      <section aria-labelledby={`${id}-price`} className="flex flex-col gap-4 border-t border-border pt-6">
        <h3 id={`${id}-price`} className="text-base font-bold">
          Faixa de preço
        </h3>
        <PriceRangeFilter
          key={`${facets.priceRange.min}:${facets.priceRange.max}:${search.minPrice ?? ''}:${search.maxPrice ?? ''}`}
          min={facets.priceRange.min}
          max={facets.priceRange.max}
        />
      </section>

      <section aria-labelledby={`${id}-networks`} className="flex flex-col gap-3 border-t border-border pt-6">
        <h3 id={`${id}-networks`} className="text-base font-bold">
          Rede
        </h3>
        {facets.networks.map((facet) => {
          const parsed = networkSchema.safeParse(facet.id)
          if (!parsed.success) return null
          return (
            <FilterItem
              key={facet.id}
              label={facet.label}
              count={facet.count}
              active={networks.includes(parsed.data)}
              onToggle={() => toggleNetwork(parsed.data)}
            />
          )
        })}
      </section>

      {activeFilters > 0 && (
        <Button variant="link" size="sm" className="w-fit px-0" onClick={reset}>
          Limpar filtros
        </Button>
      )}
    </div>
  )
}

export function CatalogFiltersSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-hidden="true">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-24" />
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full max-w-[220px]" />
        ))}
      </div>
      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-7 w-16" />
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-6">
        <Skeleton className="h-5 w-16" />
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full max-w-[160px]" />
        ))}
      </div>
    </div>
  )
}
