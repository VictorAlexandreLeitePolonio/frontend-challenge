import { useId } from 'react'
import { Loader2, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  /** Estoque atual da edição. Em 0 o controle fica bloqueado. */
  max: number
  onChange: (quantity: number) => void
  label: string
  pending?: boolean
  describedBy?: string
  className?: string
}

/** Stepper − / campo / + limitado a 1..max. O campo aceita digitação e só envia no blur/Enter. */
export function QuantityStepper({ value, max, onChange, label, pending = false, describedBy, className }: QuantityStepperProps) {
  const inputId = useId()
  const disabled = pending || max <= 0

  const commit = (input: HTMLInputElement) => {
    const parsed = Number.parseInt(input.value, 10)
    if (!Number.isFinite(parsed)) {
      input.value = String(value)
      return
    }
    const next = Math.min(Math.max(parsed, 1), max)
    input.value = String(next)
    if (next !== value) onChange(next)
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        type="button"
        aria-label={`Diminuir quantidade de ${label}`}
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <label htmlFor={inputId} className="sr-only">
        Quantidade de {label}
      </label>
      <input
        key={value}
        id={inputId}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        defaultValue={value}
        disabled={disabled}
        aria-busy={pending}
        aria-describedby={describedBy}
        onChange={(event) => {
          event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '')
        }}
        onBlur={(event) => commit(event.currentTarget)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            event.currentTarget.blur()
          }
        }}
        className="h-6 w-8 rounded-sm border border-transparent bg-transparent text-center text-sm tabular-nums outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
      />
      <button
        type="button"
        aria-label={`Aumentar quantidade de ${label}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
      {pending && (
        <span className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Atualizando
        </span>
      )}
    </div>
  )
}
