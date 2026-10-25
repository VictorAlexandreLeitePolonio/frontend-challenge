import { EthPrice } from '@/components/common/EthPrice'
import { formatEth } from '@/lib/eth'
import type { Summary } from '@/schemas/common'

interface SummaryLinesProps {
  summary: Summary
}

/** Linhas de valores vindas da API (carrinho, cotação ou recibo) — nunca recalculadas no cliente. */
export function SummaryLines({ summary }: SummaryLinesProps) {
  return (
    <dl className="flex flex-col gap-3 text-sm">
      <div className="flex items-baseline justify-between gap-4">
        <dt>Subtotal</dt>
        <dd className="tabular-nums">{formatEth(summary.subtotal)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <dt>Desconto do lançamento</dt>
        <dd className="tabular-nums">(-) {formatEth(summary.discount)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <dt className="flex flex-col">
          Taxa de rede
          <span className="text-[11px] text-accent-text">Taxa estimada</span>
        </dt>
        <dd className="tabular-nums">{formatEth(summary.networkFee)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
        <dt className="font-bold">Total</dt>
        <dd>
          <EthPrice value={summary.total} className="text-base" />
        </dd>
      </div>
    </dl>
  )
}
