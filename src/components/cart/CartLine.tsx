import { useId } from 'react'
import { Link } from '@tanstack/react-router'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { errorMessage } from '@/components/common/ErrorState'
import { EthPrice } from '@/components/common/EthPrice'
import { nftImageProps } from '@/lib/images'
import { formatEth } from '@/lib/eth'
import { EDITION_LABELS } from '@/schemas/nft'
import type { CartItem } from '@/schemas/cart'
import { useAddToCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/useCart'
import { QuantityStepper } from './QuantityStepper'

interface CartLineProps {
  item: CartItem
}

export function CartLine({ item }: CartLineProps) {
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const addItem = useAddToCart()
  const warningId = useId()

  const outOfStock = item.available === 0
  const exceedsStock = item.quantity > item.available && !outOfStock
  const busy = updateItem.isPending || removeItem.isPending

  const handleQuantity = (quantity: number) => {
    updateItem.mutate(
      { itemId: item.id, quantity },
      {
        onError: (error) => toast.error(errorMessage(error, 'Não foi possível atualizar a quantidade')),
      },
    )
  }

  const handleRemove = () => {
    removeItem.mutate(item.id, {
      onSuccess: () => {
        toast(`${item.name} removido do carrinho`, {
          description: `Edição ${EDITION_LABELS[item.editionId]} · ${item.quantity} ${item.quantity === 1 ? 'unidade' : 'unidades'}`,
          action: {
            label: 'Desfazer',
            onClick: () => {
              addItem.mutate(
                { nftId: item.nftId, editionId: item.editionId, quantity: item.quantity },
                {
                  onSuccess: () => toast.success(`${item.name} voltou para o carrinho`),
                  onError: (error) => toast.error(errorMessage(error, 'Não foi possível desfazer a remoção')),
                },
              )
            },
          },
        })
      },
      onError: (error) => toast.error(errorMessage(error, 'Não foi possível remover o item')),
    })
  }

  const removeButton = (
    <button
      type="button"
      onClick={handleRemove}
      disabled={removeItem.isPending}
      aria-label={`Remover ${item.name} do carrinho`}
      className="grid size-9 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-background/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
    >
      {removeItem.isPending ? (
        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      ) : (
        <Trash2 className="size-4" aria-hidden="true" />
      )}
    </button>
  )

  const identity = (
    <div className="flex min-w-0 items-center gap-3 md:gap-4">
      <img
        {...nftImageProps(item.image, '96px')}
        alt={`Arte do NFT ${item.name}`}
        loading="lazy"
        decoding="async"
        className="size-20 shrink-0 rounded-sm object-cover md:size-[70px]"
      />
      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold md:text-base">
          <Link to="/nft/$nftId" params={{ nftId: item.nftId }} className="transition-colors hover:text-accent-text">
            {item.name}
          </Link>
        </h3>
        <p className="text-xs text-subtle">ID do token: {item.tokenId}</p>
        <p className="text-xs text-muted-foreground">Edição: {EDITION_LABELS[item.editionId]}</p>
      </div>
    </div>
  )

  const price = (
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-muted-foreground md:sr-only">Preço unitário:</span>
      <EthPrice value={item.unitPrice} previous={item.previousUnitPrice} className="text-sm md:text-[15px]" />
    </div>
  )

  const stepper = (
    <div className="flex flex-col gap-1">
      <QuantityStepper
        value={item.quantity}
        max={item.available}
        onChange={handleQuantity}
        label={item.name}
        pending={updateItem.isPending}
        describedBy={exceedsStock ? warningId : undefined}
      />
      {exceedsStock && (
        <p id={warningId} className="text-[11px] text-accent-text">
          Apenas {item.available} disponível(is) nesta edição.
        </p>
      )}
    </div>
  )

  const lineTotal = (
    <div className="flex items-baseline justify-between gap-2 md:justify-start">
      <span className="text-xs text-muted-foreground md:sr-only">Subtotal do item:</span>
      <EthPrice value={item.lineTotal} className="text-sm md:text-base" />
    </div>
  )

  return (
    <li aria-busy={busy}>
      <article className="rounded-sm border border-border bg-card p-3 md:border-0 md:bg-transparent md:p-0">
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex items-start justify-between gap-2">
            {identity}
            {removeButton}
          </div>
          <div className="flex items-center justify-between gap-3">
            {price}
            {stepper}
          </div>
          {lineTotal}
        </div>

        <div className="hidden items-center gap-4 border-b border-border py-4 md:grid md:grid-cols-[minmax(0,1fr)_100px_150px_120px_40px]">
          {identity}
          {price}
          {stepper}
          {lineTotal}
          {removeButton}
        </div>

        {outOfStock && (
          <p role="status" aria-live="polite" className="mt-2 rounded-sm border border-destructive/50 px-3 py-2 text-xs text-destructive md:mb-2">
            Esgotado — remova este item para finalizar a compra.
          </p>
        )}
        {!outOfStock && item.priceChanged && item.previousUnitPrice != null && (
          <p role="status" aria-live="polite" className="mt-2 rounded-sm border border-border-soft bg-background/40 px-3 py-2 text-xs text-accent-text md:mb-2">
            Preço alterado de {formatEth(item.previousUnitPrice)} para {formatEth(item.unitPrice)}.
            <span className="block text-muted-foreground">O total da linha foi atualizado pela loja.</span>
          </p>
        )}
      </article>
    </li>
  )
}
