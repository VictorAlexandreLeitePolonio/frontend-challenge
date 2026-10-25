import { Link } from '@tanstack/react-router'
import { ExternalLink, MailCheck, X } from 'lucide-react'
import { EthPrice } from '@/components/common/EthPrice'
import { Button } from '@/components/ui/button'
import { SummaryLines } from '@/components/cart/SummaryLines'
import { nftImageProps } from '@/lib/images'
import { NETWORK_LABELS } from '@/schemas/common'
import { EDITION_LABELS } from '@/schemas/nft'
import type { Receipt } from '@/schemas/order'

interface OrderReceiptProps {
  orderId: string
  receipt: Receipt
}

function shortHash(hash: string) {
  return hash.length > 12 ? `${hash.slice(0, 6)}…${hash.slice(-4)}` : hash
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function OrderReceipt({ orderId, receipt }: OrderReceiptProps) {
  return (
    <section aria-labelledby="order-receipt-heading" className="relative mx-auto w-full max-w-[578px] border border-border bg-card">
      <Link
        to="/cart"
        aria-label="Fechar confirmação e voltar ao carrinho"
        className="absolute top-3 right-3 grid size-8 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-background/40 hover:text-foreground"
      >
        <X className="size-5" aria-hidden="true" />
      </Link>

      <div className="flex flex-col items-center gap-4 border-b border-border px-6 py-8 text-center">
        <span className="grid size-20 place-items-center rounded-sm border border-primary/60 text-primary">
          <MailCheck className="size-9" aria-hidden="true" />
          <span className="sr-only">Obrigado</span>
        </span>
        <h1 id="order-receipt-heading" className="text-base font-bold">
          Seus NFTs agora estão na sua carteira
        </h1>
        <p className="text-xs text-muted-foreground">Pedido {orderId}</p>
      </div>

      <dl className="grid grid-cols-2 border-b border-border md:grid-cols-4">
        <div className="border-b border-border px-4 py-3 md:border-r md:border-b-0">
          <dt className="text-xs text-muted-foreground">ID da transação</dt>
          <dd className="mt-1 text-sm font-bold">
            {shortHash(receipt.txHash)}
            <span className="sr-only"> (hash completo: {receipt.txHash})</span>
          </dd>
        </div>
        <div className="border-b border-border px-4 py-3 md:border-r md:border-b-0">
          <dt className="text-xs text-muted-foreground">Data</dt>
          <dd className="mt-1 text-sm font-bold">{formatDate(receipt.createdAt)}</dd>
        </div>
        <div className="border-border px-4 py-3 md:border-r">
          <dt className="text-xs text-muted-foreground">Total</dt>
          <dd className="mt-1">
            <EthPrice value={receipt.total} className="text-sm" />
          </dd>
        </div>
        <div className="px-4 py-3">
          <dt className="text-xs text-muted-foreground">Carteira</dt>
          <dd className="mt-1 text-sm font-bold">{receipt.walletLabel}</dd>
        </div>
      </dl>

      <div className="px-4 py-6 md:px-6">
        <h2 className="text-sm font-bold">Detalhes da transação</h2>

        <div className="mt-4 hidden grid-cols-[minmax(0,1fr)_100px_120px] gap-4 border-b border-border pb-2 text-xs text-muted-foreground md:grid">
          <span>NFTs</span>
          <span>Edições</span>
          <span>Subtotal</span>
        </div>

        <ul className="divide-y divide-border">
          {receipt.items.map((item) => (
            <li key={`${item.nftId}-${item.editionId}`} className="flex items-center gap-3 py-3">
              <img
                {...nftImageProps(item.image, '64px')}
                alt={`Arte do NFT ${item.name}`}
                loading="lazy"
                decoding="async"
                className="size-14 shrink-0 rounded-sm object-cover md:size-[66px]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{item.name}</p>
                <p className="text-xs text-subtle">ID do token: {item.tokenId}</p>
                <p className="text-xs text-muted-foreground">Edição: {EDITION_LABELS[item.editionId]}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                <span className="text-xs text-muted-foreground">(x {item.quantity})</span>
                <EthPrice value={item.lineTotal} className="text-sm" />
              </div>
            </li>
          ))}
        </ul>

        {receipt.couponCode && (
          <p className="mt-4 text-sm text-muted-foreground">
            Cupom aplicado: <span className="font-bold text-accent-text">{receipt.couponCode}</span>
          </p>
        )}

        <div className="mt-5 border-t border-border pt-4">
          <SummaryLines summary={receipt} networkFeeHint={false} />
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Transação confirmada na {NETWORK_LABELS[receipt.network]}. A propriedade foi transferida para sua carteira
          conectada e registrada na rede.
        </p>

        <div className="mt-5 flex justify-center">
          <Button asChild className="h-12 rounded-full md:h-10 md:rounded-sm">
            <a href={receipt.explorerUrl} target="_blank" rel="noopener noreferrer">
              Ver no Etherscan (simulado)
              <ExternalLink aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>

      <div className="h-2.5 w-full bg-primary" aria-hidden="true" />
    </section>
  )
}
