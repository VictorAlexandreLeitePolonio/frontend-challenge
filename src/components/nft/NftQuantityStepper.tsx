import { useId } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface NftQuantityStepperProps {
  quantity: number
  max: number
  onChange: (quantity: number) => void
  disabled?: boolean
  className?: string
}

export function NftQuantityStepper({ quantity, max, onChange, disabled = false, className }: NftQuantityStepperProps) {
  const inputId = useId()
  const limitId = useId()
  const atLimit = max > 0 && quantity >= max
  const soldOut = max <= 0

  const update = (next: number) => {
    if (soldOut) return
    onChange(Math.min(Math.max(1, Math.trunc(next)), max))
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          Quantidade
        </label>
        <Button
          type="button"
          size="icon"
          className="size-9 rounded-full"
          aria-label="Diminuir quantidade"
          disabled={disabled || soldOut || quantity <= 1}
          onClick={() => update(quantity - 1)}
        >
          <Minus aria-hidden="true" />
        </Button>
        <Input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={1}
          max={Math.max(1, max)}
          value={quantity}
          disabled={disabled || soldOut}
          aria-describedby={limitId}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (Number.isFinite(next)) update(next)
          }}
          className="h-9 w-12 rounded-none border-0 bg-transparent px-1 text-center text-lg font-bold focus-visible:ring-1"
        />
        <Button
          type="button"
          size="icon"
          className="size-9 rounded-full"
          aria-label="Aumentar quantidade"
          disabled={disabled || soldOut || atLimit}
          onClick={() => update(quantity + 1)}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
      <p id={limitId} aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {soldOut ? 'Edição esgotada.' : atLimit ? `Quantidade máxima: ${max}.` : ''}
      </p>
    </div>
  )
}
