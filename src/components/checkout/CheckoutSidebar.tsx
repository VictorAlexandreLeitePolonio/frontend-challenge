import { Link } from '@tanstack/react-router'
import { EthPrice } from '@/components/common/EthPrice'
import { nftImageProps } from '@/lib/images'
import { EDITION_LABELS } from '@/schemas/nft'
import type { Cart } from '@/schemas/cart'
import type { Wallet } from '@/schemas/wallet'
import { SummaryLines } from '@/components/cart/SummaryLines'
import { WalletPicker } from './WalletPicker'

interface CheckoutSidebarProps {
  cart: Cart
  wallets: Wallet[]
  selectedWalletId: string | null
  onSelectWallet: (wallet: Wallet) => void
  onDisconnectWallet?: (wallet: Wallet) => void
  walletDisabled?: boolean
  children?: React.ReactNode
}

export function CheckoutSidebar({
  cart,
  wallets,
  selectedWalletId,
  onSelectWallet,
  onDisconnectWallet,
  walletDisabled,
  children,
}: CheckoutSidebarProps) {
  return (
    <aside
      aria-label="Resumo do pagamento"
      className="flex flex-col gap-6 rounded-2xl bg-card p-4 md:rounded-none md:bg-transparent md:p-0"
    >
      <section aria-labelledby="checkout-nfts-heading">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h2 id="checkout-nfts-heading" className="font-bold">
            Seus NFTs
          </h2>
          <span className="text-sm text-muted-foreground">Subtotal</span>
        </div>
        <ul className="divide-y divide-border">
          {cart.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <img
                {...nftImageProps(item.image, '64px')}
                alt={`Arte do NFT ${item.name}`}
                loading="lazy"
                decoding="async"
                className="size-14 shrink-0 rounded-sm object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{item.name}</p>
                <p className="text-xs text-subtle">ID do token: {item.tokenId}</p>
                <p className="text-xs text-muted-foreground">Edição: {EDITION_LABELS[item.editionId]}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">(x {item.quantity})</span>
                <EthPrice value={item.lineTotal} className="text-sm" />
              </div>
            </li>
          ))}
        </ul>
        <Link to="/cart" className="mt-3 inline-block text-sm text-accent-text underline-offset-4 hover:underline">
          Tem um código promocional? Aplique aqui
        </Link>
      </section>

      <section aria-labelledby="checkout-summary-heading">
        <h2 id="checkout-summary-heading" className="sr-only">
          Resumo do pedido
        </h2>
        <SummaryLines summary={cart.summary} />
      </section>

      <WalletPicker
        wallets={wallets}
        selectedId={selectedWalletId}
        onSelect={onSelectWallet}
        onDisconnect={onDisconnectWallet}
        disabled={walletDisabled}
      />

      {children}
    </aside>
  )
}
