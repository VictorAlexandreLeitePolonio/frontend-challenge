import { useCallback, useEffect, useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ApiError } from '@/api/client'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState, errorMessage } from '@/components/common/ErrorState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { CheckoutSidebar } from '@/components/checkout/CheckoutSidebar'
import { CheckoutSkeleton } from '@/components/checkout/CheckoutSkeleton'
import { QuoteDiff } from '@/components/checkout/QuoteDiff'
import { QuoteReview } from '@/components/checkout/QuoteReview'
import { type CheckoutFormValues } from '@/components/checkout/checkout-form-schema'
import { MobileBackLink } from '@/components/cart/MobileBackLink'
import { PageBreadcrumbs } from '@/components/cart/PageBreadcrumbs'
import { useProfile, useWallets } from '@/hooks/useAccount'
import { useCart } from '@/hooks/useCart'
import { useCreateQuote, usePlaceOrder } from '@/hooks/useCheckout'
import { checkoutDraftStore } from '@/lib/storage'
import { realtimeEvents } from '@/realtime/events'
import type { User } from '@/schemas/auth'
import type { Cart } from '@/schemas/cart'
import type { Profile } from '@/schemas/profile'
import { quoteSchema, type Quote } from '@/schemas/quote'
import type { Wallet } from '@/schemas/wallet'

const FORM_ID = 'checkout-form'
const REASON_ID = 'checkout-cta-reason'

export const Route = createFileRoute('/_auth/checkout')({
  component: Page,
})

function Page() {
  const { user } = Route.useRouteContext()
  const cart = useCart()
  const wallets = useWallets()
  const profile = useProfile()

  if (cart.isPending || wallets.isPending || profile.isPending) {
    return (
      <CheckoutShell>
        <CheckoutSkeleton />
      </CheckoutShell>
    )
  }

  if (cart.isError) {
    return (
      <CheckoutShell>
        <ErrorState
          error={cart.error}
          title="Não foi possível carregar o carrinho"
          onRetry={() => void cart.refetch()}
          isRetrying={cart.isFetching}
        />
      </CheckoutShell>
    )
  }

  if (wallets.isError) {
    return (
      <CheckoutShell>
        <ErrorState
          error={wallets.error}
          title="Não foi possível carregar suas carteiras"
          onRetry={() => void wallets.refetch()}
          isRetrying={wallets.isFetching}
        />
      </CheckoutShell>
    )
  }

  if (!cart.data || !wallets.data) {
    return (
      <CheckoutShell>
        <CheckoutSkeleton />
      </CheckoutShell>
    )
  }

  if (cart.data.items.length === 0) {
    return (
      <CheckoutShell>
        <EmptyState
          title="Seu carrinho está vazio"
          description="Adicione NFTs ao carrinho para revisar o pagamento."
          action={
            <Button asChild>
              <Link to="/" hash="catalogo">
                Explorar NFTs
              </Link>
            </Button>
          }
        />
      </CheckoutShell>
    )
  }

  return (
    <CheckoutShell>
      <CheckoutContent cart={cart.data} wallets={wallets.data} profile={profile.data ?? null} user={user} />
    </CheckoutShell>
  )
}

function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer className="py-8 md:py-10">
      <div className="hidden md:block">
        <PageBreadcrumbs current="Pagamento" />
      </div>
      <header className="mb-6 flex items-center justify-between gap-3 md:hidden">
        <MobileBackLink to="/cart" label="Voltar ao carrinho" />
        <h1 className="flex-1 text-center text-base font-bold">Pagamento</h1>
        <span className="size-9 shrink-0" aria-hidden="true" />
      </header>
      <h1 className="sr-only hidden md:block">Pagamento</h1>
      {children}
    </PageContainer>
  )
}

interface CheckoutContentProps {
  cart: Cart
  wallets: Wallet[]
  profile: Profile | null
  user: User
}

function draftText(draft: Record<string, unknown> | null, key: string) {
  const value = draft?.[key]
  return typeof value === 'string' ? value : undefined
}

function CheckoutContent({ cart, wallets, profile, user }: CheckoutContentProps) {
  const navigate = useNavigate()
  const createQuote = useCreateQuote()
  const placeOrder = usePlaceOrder()
  const resetPlaceOrder = placeOrder.reset

  const primaryWallet = wallets.find((wallet) => wallet.slot === 'primary') ?? wallets[0] ?? null
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(primaryWallet?.id ?? null)
  const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId) ?? null

  const draftStore = useMemo(() => checkoutDraftStore(user.id), [user.id])
  const [initialValues] = useState<CheckoutFormValues>(() => {
    const draft = draftStore.get()
    return {
      displayName: draftText(draft, 'displayName') ?? profile?.displayName ?? user.displayName,
      username: draftText(draft, 'username') ?? profile?.username ?? user.username,
      profileName: draftText(draft, 'profileName') ?? primaryWallet?.profileName ?? profile?.walletNickname ?? '',
      email: draftText(draft, 'email') ?? profile?.email ?? user.email,
      note: draftText(draft, 'note') ?? '',
    }
  })

  const [quote, setQuote] = useState<Quote | null>(null)
  const [staleDiff, setStaleDiff] = useState<{ previous: Quote; next: Quote } | null>(null)
  const [reviewBuyer, setReviewBuyer] = useState<CheckoutFormValues | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const blockedItem = cart.items.find((item) => item.available === 0 || item.quantity > item.available)
  const cartNftIds = useMemo(() => new Set(cart.items.map((item) => item.nftId)), [cart.items])

  const handleValuesChange = useCallback(
    (values: Partial<CheckoutFormValues>) => {
      draftStore.set(values)
    },
    [draftStore],
  )

  const pendingOrderId = placeOrder.attempt?.orderId

  useEffect(() => {
    if (!pendingOrderId) return
    draftStore.set(null)
    void navigate({ to: '/orders/$orderId', params: { orderId: pendingOrderId } })
  }, [pendingOrderId, draftStore, navigate])

  useEffect(() => {
    if (!quote) return
    return realtimeEvents.on('nft.updated', (event) => {
      if (!cartNftIds.has(event.resource.id)) return
      setQuote(null)
      setStaleDiff(null)
      setReviewBuyer(null)
      setNotice('Um NFT deste pedido foi atualizado. Revise o pedido novamente.')
      resetPlaceOrder()
    })
  }, [quote, cartNftIds, resetPlaceOrder])

  const handleSelectWallet = (wallet: Wallet) => {
    setSelectedWalletId(wallet.id)
    if (quote && quote.walletId !== wallet.id) {
      setQuote(null)
      setStaleDiff(null)
      setReviewBuyer(null)
      setNotice('Carteira alterada. Revise o pedido antes de confirmar novamente.')
      resetPlaceOrder()
    }
  }

  const handleDisconnectWallet = (wallet: Wallet) => {
    if (!quote || quote.walletId !== wallet.id) return
    setQuote(null)
    setStaleDiff(null)
    setReviewBuyer(null)
    setNotice('A carteira selecionada não está mais conectada. Conecte-a e revise o pedido novamente.')
    resetPlaceOrder()
  }

  const handleReview = (values: CheckoutFormValues) => {
    if (unconfirmedAttempt) {
      setNotice('Conclua a tentativa de compra anterior com "Tentar novamente" antes de revisar outro pedido.')
      return
    }
    if (!selectedWallet) {
      setNotice('Selecione uma carteira para revisar o pedido.')
      return
    }
    if (!selectedWallet.connected) {
      setNotice('Conecte a carteira selecionada para revisar o pedido.')
      return
    }
    if (blockedItem) {
      setNotice('Há itens indisponíveis no carrinho. Ajuste as quantidades antes de revisar.')
      return
    }
    setReviewBuyer(values)
    setNotice(null)
    createQuote.mutate(
      { network: selectedWallet.network, walletId: selectedWallet.id },
      {
        onSuccess: (created) => {
          setQuote(created)
          setStaleDiff(null)
          setNotice(null)
          resetPlaceOrder()
        },
        onError: (error) => toast.error(errorMessage(error, 'Não foi possível revisar o pedido')),
      },
    )
  }

  const handlePlaceOrderError = (error: unknown, previousQuote: Quote | null) => {
    if (!(error instanceof ApiError)) return
    if (error.code !== 'QUOTE_STALE') {
      if (!error.isTransient) placeOrder.clearAttempt()
      return
    }
    const fresh = freshQuoteFrom(error.details)
    resetPlaceOrder()
    placeOrder.clearAttempt()
    if (fresh) {
      setStaleDiff(previousQuote ? { previous: previousQuote, next: fresh } : null)
      setQuote(fresh)
      setNotice(previousQuote ? null : 'A cotação foi atualizada. Revise os valores e confirme novamente.')
      return
    }
    setQuote(null)
    setStaleDiff(null)
    setReviewBuyer(null)
    setNotice('A cotação mudou e o carrinho precisa de ajustes. Volte ao carrinho para revisar.')
  }

  const handleConfirm = () => {
    if (!quote || !selectedWallet || !selectedWallet.connected) return
    const buyerValues = reviewBuyer ?? initialValues
    const buyer = {
      ...buyerValues,
      network: selectedWallet.network,
      address: selectedWallet.address,
      secondaryAddress: selectedWallet.secondaryAddress,
      provider: selectedWallet.provider,
      referralCode: selectedWallet.referralCode,
      ensName: selectedWallet.ensName,
    }
    void placeOrder
      .placeOrder({
        quoteId: quote.id,
        walletId: selectedWallet.id,
        network: selectedWallet.network,
        buyer,
      })
      .catch((error: unknown) => handlePlaceOrderError(error, quote))
  }

  const handleBackToEdit = () => {
    setQuote(null)
    setStaleDiff(null)
    setReviewBuyer(null)
    setNotice(null)
    createQuote.reset()
    resetPlaceOrder()
  }

  const handleRetry = () => {
    if (!placeOrder.attempt) return
    void placeOrder.retry().catch((error: unknown) => handlePlaceOrderError(error, quote))
  }

  const placeError = placeOrder.error
  const uncertain = placeError instanceof ApiError && (placeError.isTimeout || placeError.isNetwork || placeError.status >= 500)
  const unconfirmedAttempt = Boolean(placeOrder.attempt && !placeOrder.attempt.orderId)
  const unresolvedAttempt = unconfirmedAttempt && !placeOrder.isPending
  const reason = unresolvedAttempt
    ? 'Conclua a tentativa de compra anterior com "Tentar novamente" antes de revisar outro pedido.'
    : !selectedWallet
      ? 'Selecione uma carteira para continuar.'
      : !selectedWallet.connected
        ? 'Conecte a carteira selecionada para continuar.'
        : blockedItem
          ? 'Ajuste os itens indisponíveis no carrinho para continuar.'
          : null
  const canProceed = reason === null
  const busy = createQuote.isPending || placeOrder.isPending

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_332px] xl:gap-x-[86px]" aria-busy={busy}>
      <div className="flex flex-col gap-6">
        {notice && (
          <p role="status" aria-live="polite" className="rounded-sm border border-border-soft bg-background/40 px-4 py-3 text-sm text-accent-text">
            {notice}
          </p>
        )}

        {blockedItem && (
          <div role="alert" className="rounded-sm border border-destructive/50 px-4 py-3 text-sm text-destructive">
            <p className="font-bold">Item indisponível no carrinho</p>
            <p className="mt-1">
              {blockedItem.name} está esgotado ou com quantidade acima do estoque.{' '}
              <Link to="/cart" className="underline underline-offset-4">
                Voltar ao carrinho
              </Link>{' '}
              para ajustar.
            </p>
          </div>
        )}

        <div className={quote ? 'hidden' : 'flex flex-col gap-6'}>
          <CheckoutForm
            formId={FORM_ID}
            defaultValues={initialValues}
            disabled={createQuote.isPending}
            onValuesChange={handleValuesChange}
            onSubmit={handleReview}
          />
          {(placeError || unconfirmedAttempt) && (
            <PlaceErrorPanel
              error={placeError}
              uncertain={!placeError || uncertain}
              onRetry={handleRetry}
              isRetrying={placeOrder.isPending}
            />
          )}
          {createQuote.isError && (
            <div role="alert" className="rounded-sm border border-destructive/50 px-4 py-3 text-sm">
              <p className="font-bold">Não foi possível revisar o pedido</p>
              <p className="mt-1 text-muted-foreground">{errorMessage(createQuote.error, 'Tente novamente em instantes.')}</p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link to="/cart">Revisar carrinho</Link>
              </Button>
            </div>
          )}
        </div>

        {quote && (
          <div className="flex flex-col gap-6">
            {staleDiff && <QuoteDiff previous={staleDiff.previous} next={staleDiff.next} />}
            <QuoteReview quote={quote} />
            {placeError && !placeOrder.isPending && (
              <PlaceErrorPanel error={placeError} uncertain={uncertain} onRetry={handleRetry} isRetrying={placeOrder.isPending} />
            )}
          </div>
        )}
      </div>

      <CheckoutSidebar
        cart={cart}
        wallets={wallets}
        selectedWalletId={selectedWalletId}
        onSelectWallet={handleSelectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        walletDisabled={placeOrder.isPending}
      >
        {wallets.length > 0 && (
          <div className="flex flex-col gap-3">
            {quote ? (
              <>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canProceed || placeOrder.isPending}
                  aria-describedby={reason ? REASON_ID : undefined}
                  className="h-12 w-full rounded-full md:h-10 md:rounded-sm"
                >
                  {placeOrder.isPending ? (
                    <>
                      <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                      Confirmando…
                    </>
                  ) : (
                    'Confirmar compra'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToEdit}
                  disabled={placeOrder.isPending}
                  className="h-12 w-full rounded-full md:h-10 md:rounded-sm"
                >
                  Voltar e editar
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                form={FORM_ID}
                disabled={!canProceed || createQuote.isPending || placeOrder.isPending}
                aria-describedby={reason ? REASON_ID : undefined}
                className="h-12 w-full rounded-full md:h-10 md:rounded-sm"
              >
                {createQuote.isPending ? (
                  <>
                    <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    Revisando…
                  </>
                ) : (
                  'Revisar pedido'
                )}
              </Button>
            )}
            {reason && (
              <p id={REASON_ID} className="text-xs text-muted-foreground">
                {reason}
              </p>
            )}
            <Link to="/cart" className="text-center text-sm text-accent-text underline-offset-4 hover:underline">
              Voltar ao carrinho
            </Link>
          </div>
        )}
      </CheckoutSidebar>
    </div>
  )
}

function freshQuoteFrom(details: unknown): Quote | null {
  if (typeof details !== 'object' || details === null || !('quote' in details)) return null
  const parsed = quoteSchema.safeParse(details.quote)
  return parsed.success ? parsed.data : null
}

interface PlaceErrorPanelProps {
  error: unknown
  uncertain: boolean
  onRetry: () => void
  isRetrying: boolean
}

function PlaceErrorPanel({ error, uncertain, onRetry, isRetrying }: PlaceErrorPanelProps) {
  if (uncertain) {
    return (
      <div role="alert" className="rounded-sm border border-accent-text/60 bg-background/40 px-4 py-4 text-sm">
        <p className="font-bold text-accent-text">Não confirmamos seu pedido ainda</p>
        <p className="mt-1 text-muted-foreground">
          A rede demorou para responder. Tente novamente com segurança: vamos reenviar a mesma tentativa, sem duplicar a compra.
        </p>
        <Button type="button" onClick={onRetry} disabled={isRetrying} className="mt-4">
          {isRetrying ? (
            <>
              <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Tentando novamente…
            </>
          ) : (
            'Tentar novamente'
          )}
        </Button>
      </div>
    )
  }

  return (
    <div role="alert" className="rounded-sm border border-destructive/50 px-4 py-4 text-sm">
      <p className="font-bold">Não foi possível confirmar a compra</p>
      <p className="mt-1 text-muted-foreground">{errorMessage(error, 'Tente novamente em instantes.')}</p>
    </div>
  )
}
