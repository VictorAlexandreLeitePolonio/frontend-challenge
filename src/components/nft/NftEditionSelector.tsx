import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { EDITION_LABELS, type Edition, type EditionId } from '@/schemas/nft'

interface NftEditionSelectorProps {
  editions: Edition[]
  value: EditionId
  onChange: (edition: EditionId) => void
}

export function NftEditionSelector({ editions, value, onChange }: NftEditionSelectorProps) {
  const labelId = useId()

  return (
    <div className="flex flex-col gap-3">
      <p id={labelId} className="text-sm">
        Edição:
      </p>
      <RadioGroup
        aria-labelledby={labelId}
        value={value}
        onValueChange={(next) => {
          const edition = editions.find((item) => item.id === next)
          if (edition && edition.available > 0) onChange(edition.id)
        }}
        orientation="horizontal"
        className="flex flex-wrap gap-2"
      >
        {editions.map((edition) => {
          const soldOut = edition.available === 0
          const active = !soldOut && edition.id === value
          const itemId = `${labelId}-${edition.id.replace('/', '-')}`
          return (
            <div key={edition.id} className="relative">
              <RadioGroupItem
                id={itemId}
                value={edition.id}
                disabled={soldOut}
                className="sr-only"
              />
              <Label
                htmlFor={itemId}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1 text-sm font-normal transition-colors',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
                  active && 'border-primary font-bold text-accent-text',
                  soldOut && 'cursor-not-allowed text-muted-foreground opacity-60',
                )}
              >
                {EDITION_LABELS[edition.id]}
                {soldOut && <span className="text-xs">Esgotada</span>}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
