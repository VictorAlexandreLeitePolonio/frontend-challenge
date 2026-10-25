import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ApiError } from '@/api/client'
import { errorMessage } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { useConnectWallet, useDisconnectWallet } from '@/hooks/useAccount'
import { NETWORK_LABELS } from '@/schemas/common'
import { WALLET_PROVIDER_LABELS, type Wallet } from '@/schemas/wallet'

interface InfoProps {
  label: string
  children: React.ReactNode
}

function Info({ label, children }: InfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="text-sm break-words text-foreground">{children}</dd>
    </div>
  )
}

interface WalletDetailsProps {
  wallet: Wallet
}

export function WalletDetails({ wallet }: WalletDetailsProps) {
  const connect = useConnectWallet()
  const disconnect = useDisconnectWallet()
  const [actionError, setActionError] = useState<string | null>(null)
  const pending = connect.isPending || disconnect.isPending

  const onConnect = () => {
    setActionError(null)
    connect.mutate(wallet.id, {
      onSuccess: () => toast.success('Carteira conectada'),
      onError: (error) => {
        setActionError(error instanceof ApiError && error.code === 'WALLET_REJECTED' ? 'Conexão recusada pela carteira' : errorMessage(error))
      },
    })
  }

  const onDisconnect = () => {
    setActionError(null)
    disconnect.mutate(wallet.id, {
      onSuccess: () => toast.success('Carteira desconectada'),
      onError: (error) => setActionError(errorMessage(error)),
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p role="status" className="flex items-center gap-2 text-sm">
          <span className={`size-2 rounded-full ${wallet.connected ? 'bg-primary' : 'bg-muted-foreground'}`} aria-hidden="true" />
          {wallet.connected ? 'Carteira conectada' : 'Carteira desconectada'}
        </p>
        <div className="flex flex-wrap gap-2">
          {wallet.connected ? (
            <Button type="button" variant="outline" onClick={onDisconnect} disabled={pending}>
              {disconnect.isPending ? 'Desconectando…' : 'Desconectar'}
            </Button>
          ) : (
            <Button type="button" onClick={onConnect} disabled={pending}>
              {connect.isPending ? 'Conectando…' : 'Conectar'}
            </Button>
          )}
        </div>
      </div>

      {actionError && (
        <div role="alert" className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{actionError}</span>
        </div>
      )}

      <dl className="grid gap-5 rounded-sm border border-border bg-background/20 p-5 sm:grid-cols-2">
        <Info label="Nome de exibição">{wallet.displayName}</Info>
        <Info label="Apelido da carteira">{wallet.nickname}</Info>
        <Info label="Rede">{NETWORK_LABELS[wallet.network]}</Info>
        <Info label="Tipo de carteira">{WALLET_PROVIDER_LABELS[wallet.provider]}</Info>
        <Info label="Endereço da carteira">
          <span className="break-all">{wallet.address}</span>
        </Info>
        <Info label="Nome ENS">{wallet.ensName}.eth</Info>
        {wallet.secondaryAddress && <Info label="ENS ou carteira secundária">{wallet.secondaryAddress}</Info>}
        <Info label="Nome do perfil">{wallet.profileName}</Info>
        <Info label="Código de indicação">{wallet.referralCode}</Info>
        <Info label="E-mail">{wallet.email}</Info>
      </dl>
    </div>
  )
}
