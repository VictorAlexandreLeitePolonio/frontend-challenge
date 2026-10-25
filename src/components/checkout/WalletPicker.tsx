import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { ApiError } from '@/api/client'
import { errorMessage } from '@/components/common/ErrorState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useConnectWallet, useDisconnectWallet } from '@/hooks/useAccount'
import { NETWORK_LABELS } from '@/schemas/common'
import { WALLET_PROVIDER_LABELS, type Wallet } from '@/schemas/wallet'
import { cn } from '@/lib/utils'

interface WalletPickerProps {
  wallets: Wallet[]
  selectedId: string | null
  onSelect: (wallet: Wallet) => void
  onDisconnect?: (wallet: Wallet) => void
  disabled?: boolean
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function WalletPicker({ wallets, selectedId, onSelect, onDisconnect, disabled = false }: WalletPickerProps) {
  const connect = useConnectWallet()
  const disconnect = useDisconnectWallet()
  const [actionError, setActionError] = useState<string | null>(null)

  if (wallets.length === 0) {
    return (
      <section aria-labelledby="wallet-picker-heading" className="border-t border-border pt-5">
        <h2 id="wallet-picker-heading" className="font-bold">
          Carteira e rede
        </h2>
        <div className="mt-3 rounded-sm border border-dashed border-border-soft p-4">
          <p className="font-bold">Nenhuma carteira cadastrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre uma carteira para pagar com segurança. Você volta direto para o pagamento depois.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/wallets" search={{ redirect: '/checkout' }}>
              Cadastrar carteira
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  const handleConnect = (wallet: Wallet) => {
    setActionError(null)
    connect.mutate(wallet.id, {
      onError: (error) => {
        setActionError(error instanceof ApiError && error.code === 'WALLET_REJECTED' ? 'Conexão recusada pela carteira' : errorMessage(error))
      },
    })
  }

  const handleDisconnect = (wallet: Wallet) => {
    setActionError(null)
    disconnect.mutate(wallet.id, {
      onSuccess: (updated) => onDisconnect?.(updated),
      onError: (error) => setActionError(errorMessage(error)),
    })
  }

  return (
    <section aria-labelledby="wallet-picker-heading" className="border-t border-border pt-5">
      <h2 id="wallet-picker-heading" className="font-bold">
        Carteira e rede
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">Escolha a carteira conectada que assinará a compra.</p>

      <RadioGroup
        value={selectedId ?? ''}
        onValueChange={(value) => {
          const wallet = wallets.find((item) => item.id === value)
          if (wallet) onSelect(wallet)
        }}
        disabled={disabled}
        aria-label="Carteira e rede"
        className="mt-3 gap-3"
      >
        {wallets.map((wallet) => {
          const isSelected = wallet.id === selectedId
          const isConnecting = connect.isPending && connect.variables === wallet.id
          const isDisconnecting = disconnect.isPending && disconnect.variables === wallet.id
          return (
            <div
              key={wallet.id}
              className={cn('rounded-sm border bg-background/20 p-3', isSelected ? 'border-primary' : 'border-border')}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem value={wallet.id} id={`wallet-${wallet.id}`} className="mt-1" />
                <div className="min-w-0 flex-1">
                  <Label htmlFor={`wallet-${wallet.id}`} className="flex flex-wrap items-baseline gap-2">
                    <span className="font-bold">{wallet.slot === 'primary' ? 'Principal' : 'Secundária'}</span>
                    <span className="text-xs text-muted-foreground">{wallet.nickname}</span>
                  </Label>
                  <p className="mt-1 text-xs break-all text-subtle">
                    {shortAddress(wallet.address)} · {NETWORK_LABELS[wallet.network]}
                  </p>
                  <p className="text-xs text-muted-foreground">{WALLET_PROVIDER_LABELS[wallet.provider]}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 pl-7">
                <Badge variant={wallet.connected ? 'default' : 'secondary'}>
                  {wallet.connected ? 'Conectada' : 'Não conectada'}
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant={wallet.connected ? 'ghost' : 'outline'}
                  disabled={disabled || isConnecting || isDisconnecting}
                  onClick={() => (wallet.connected ? handleDisconnect(wallet) : handleConnect(wallet))}
                >
                  {isConnecting || isDisconnecting ? (
                    <>
                      <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                      {isConnecting ? 'Conectando…' : 'Desconectando…'}
                    </>
                  ) : wallet.connected ? (
                    'Desconectar'
                  ) : (
                    'Conectar'
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </RadioGroup>

      {actionError && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {actionError}
        </p>
      )}
    </section>
  )
}
