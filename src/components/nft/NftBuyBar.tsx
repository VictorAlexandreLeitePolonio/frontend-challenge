import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { EthPrice } from '@/components/common/EthPrice'
import { Button } from '@/components/ui/button'
import { NftQuantityStepper } from './NftQuantityStepper'

interface NftBuyBarProps {
  price: string
  quantity: number
  max: number
  onQuantityChange: (quantity: number) => void
  onBuy: () => void
  isPending: boolean
  error: string | null
}

export function NftBuyBar({ price, quantity, max, onQuantityChange, onBuy, isPending, error }: NftBuyBarProps) {
  const soldOut = max <= 0

  return (
    <div className="fixed inset-x-0 bottom-[88px] z-30 border-t border-border bg-card px-4 pt-3 pb-3 md:hidden">
      {error && (
        <p role="alert" className="mb-2 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-end justify-between gap-4">
        <NftQuantityStepper quantity={quantity} max={max} onChange={onQuantityChange} disabled={isPending} />
        <EthPrice value={price} className="pb-5 text-base" />
      </div>
      <div className="mt-2 flex gap-3">
        <Button
          className="h-12 flex-1 rounded-full text-base"
          onClick={onBuy}
          disabled={soldOut || isPending}
        >
          {soldOut ? 'Esgotado' : isPending ? 'Adicionando…' : 'Comprar NFT'}
        </Button>
        <Button asChild variant="outline" size="icon" className="size-12 shrink-0 rounded-full">
          <Link to="/cart" aria-label="Ver carrinho">
            <ShoppingCart aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
