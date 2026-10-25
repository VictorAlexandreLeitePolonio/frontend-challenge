import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Wallet, WalletSlot } from '@/schemas/wallet'
import { WalletDetails } from './WalletDetails'
import { WalletForm } from './WalletForm'

type Mode = 'view' | 'form' | 'empty'

interface WalletCardProps {
  slot: WalletSlot
  title: string
  description?: string
  emptyMessage: string
  wallet: Wallet | undefined
  openFormWhenEmpty?: boolean
  onSaved: (wallet: Wallet) => void
}

export function WalletCard({ slot, title, description, emptyMessage, wallet, openFormWhenEmpty = false, onSaved }: WalletCardProps) {
  const [mode, setMode] = useState<Mode>(() => (wallet ? 'view' : openFormWhenEmpty ? 'form' : 'empty'))

  const titleId = `wallet-${slot}-title`
  const canCancel = Boolean(wallet) || !openFormWhenEmpty

  const handleSaved = (saved: Wallet) => {
    setMode('view')
    onSaved(saved)
  }

  return (
    <section aria-labelledby={titleId} className="flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="text-base font-bold">
            {title}
          </h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {mode === 'view' && wallet && (
          <Button type="button" variant="outline" onClick={() => setMode('form')}>
            Editar
          </Button>
        )}
        {mode === 'empty' && (
          <Button type="button" onClick={() => setMode('form')}>
            Adicionar
          </Button>
        )}
      </div>

      <div className="mt-6">
        {mode === 'empty' && <p className="text-sm text-muted-foreground">{emptyMessage}</p>}
        {mode === 'view' && wallet && <WalletDetails wallet={wallet} />}
        {mode === 'form' && (
          <WalletForm
            slot={slot}
            wallet={wallet}
            onSaved={handleSaved}
            onCancel={canCancel ? () => setMode(wallet ? 'view' : 'empty') : undefined}
          />
        )}
      </div>
    </section>
  )
}
