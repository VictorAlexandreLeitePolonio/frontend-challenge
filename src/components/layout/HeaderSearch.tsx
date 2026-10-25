import { useCallback, useEffect, useRef, useState } from 'react'
import { useMatch, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'

const DEBOUNCE_MS = 300

interface HeaderSearchProps {
  onClose: () => void
}

/** Campo de busca do header (desktop). Na home, o `q` da URL preenche o campo. */
export function HeaderSearch({ onClose }: HeaderSearchProps) {
  const navigate = useNavigate()
  const homeMatch = useMatch({ from: '/', shouldThrow: false })
  const isHome = homeMatch !== undefined
  const urlQ = homeMatch?.search.q ?? ''
  const [value, setValue] = useState(urlQ)
  const applied = useRef(urlQ)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (urlQ === applied.current) return
    applied.current = urlQ
    setValue(urlQ)
  }, [urlQ])

  const apply = useCallback(
    (q: string) => {
      if (q === applied.current) return
      applied.current = q
      if (isHome) {
        navigate({
          to: '/',
          search: (prev) => ({ ...prev, q: q || undefined, page: undefined }),
          replace: true,
          resetScroll: false,
        })
      } else {
        navigate({ to: '/', search: q ? { q } : {}, resetScroll: false })
      }
    },
    [isHome, navigate],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => apply(value.trim()), DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [value, apply])

  return (
    <form
      className="mx-10 flex max-w-md flex-1 items-center"
      onSubmit={(event) => {
        event.preventDefault()
        apply(value.trim())
      }}
    >
      <label htmlFor="catalog-search-desktop" className="sr-only">
        Buscar coleções
      </label>
      <Input
        ref={inputRef}
        id="catalog-search-desktop"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose()
        }}
        placeholder="Buscar coleções"
        className="h-10 rounded-full border-0 bg-card px-4 text-sm placeholder:text-subtle"
        autoComplete="off"
        maxLength={80}
      />
    </form>
  )
}
