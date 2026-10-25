import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NFT_SORT_LABELS, nftSortSchema, type NftSort } from '@/schemas/nft'
import { cn } from '@/lib/utils'

interface CatalogSortProps {
  value: NftSort
  onChange: (sort: NftSort) => void
  className?: string
}

export function CatalogSort({ value, onChange, className }: CatalogSortProps) {
  const id = useId()
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Label htmlFor={id} className="shrink-0 text-sm font-normal text-foreground">
        Ordenar por:
      </Label>
      <Select
        value={value}
        onValueChange={(next) => {
          const parsed = nftSortSchema.safeParse(next)
          if (parsed.success) onChange(parsed.data)
        }}
      >
        <SelectTrigger
          id={id}
          className="h-8 w-[210px] rounded-none border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {Object.entries(NFT_SORT_LABELS).map(([id, label]) => (
            <SelectItem key={id} value={id}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
