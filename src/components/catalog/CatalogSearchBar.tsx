import { useEffect, useRef, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCatalogSearch } from './useCatalogSearch'

interface CatalogSearchBarProps {
  activeFilters: number
  onOpenFilters: () => void
}

export function CatalogSearchBar({ activeFilters, onOpenFilters }: CatalogSearchBarProps) {
  const { search, update } = useCatalogSearch()
  const [value, setValue] = useState(search.q ?? '')
  const lastUrlValue = useRef(search.q ?? '')

  useEffect(() => {
    const urlValue = search.q ?? ''
    if (urlValue === lastUrlValue.current) return
    lastUrlValue.current = urlValue
    setValue(urlValue)
  }, [search.q])

  useEffect(() => {
    const urlValue = search.q ?? ''
    if (value === urlValue) return
    const timer = window.setTimeout(() => {
      lastUrlValue.current = value
      update({ q: value.trim() || undefined }, { replace: true })
    }, 300)
    return () => window.clearTimeout(timer)
  }, [value, search.q, update])

  const applyNow = () => {
    lastUrlValue.current = value
    update({ q: value.trim() || undefined }, { replace: true })
  }

  return (
    <form
      role="search"
      aria-label="Buscar no catálogo"
      className="flex items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        applyNow()
      }}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="catalog-search" className="sr-only">
          Explorar coleções
        </label>
        <Input
          id="catalog-search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Explorar coleções"
          className="h-11 rounded-full border-0 bg-card pr-4 pl-11 text-sm placeholder:text-subtle"
          autoComplete="off"
          maxLength={80}
        />
      </div>
      <Button
        type="button"
        onClick={onOpenFilters}
        className="relative size-[45px] shrink-0 rounded-xl p-0"
        aria-label={activeFilters > 0 ? `Abrir filtros, ${activeFilters} ativos` : 'Abrir filtros'}
      >
        <SlidersHorizontal className="size-5" aria-hidden="true" />
        {activeFilters > 0 && (
          <span
            className="absolute -top-1 -right-1 grid min-w-4 place-items-center rounded-full bg-background px-1 text-[10px] leading-4 font-bold text-foreground"
            aria-hidden="true"
          >
            {activeFilters}
          </span>
        )}
      </Button>
    </form>
  )
}
