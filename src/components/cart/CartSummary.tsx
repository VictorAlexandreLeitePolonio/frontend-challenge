import { useId } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ApiError } from '@/api/client'
import { FieldError } from '@/components/common/FieldError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApplyCoupon, useRemoveCoupon } from '@/hooks/useCart'
import { useSession } from '@/hooks/useSession'
import { couponInputSchema, type Cart, type CouponInput } from '@/schemas/cart'
import { SummaryLines } from './SummaryLines'

interface CartSummaryProps {
  cart: Cart
}

export function CartSummary({ cart }: CartSummaryProps) {
  const { isAuthenticated } = useSession()
  const applyCoupon = useApplyCoupon()
  const removeCoupon = useRemoveCoupon()
  const codeErrorId = useId()
  const blockedId = useId()

  const form = useForm<CouponInput>({
    resolver: zodResolver(couponInputSchema),
    defaultValues: { code: '' },
  })

  const blocked = cart.items.some((item) => item.available === 0 || item.quantity > item.available)

  const handleApply = form.handleSubmit((values) => {
    applyCoupon.mutate(values.code, {
      onSuccess: () => {
        toast.success('Cupom aplicado ao carrinho')
        form.reset()
      },
      onError: (error) => {
        if (error instanceof ApiError && (error.code === 'COUPON_INVALID' || error.code === 'COUPON_EXPIRED')) {
          form.setError('code', { message: error.message })
          return
        }
        toast.error(error instanceof ApiError ? error.message : 'Não foi possível aplicar o cupom')
      },
    })
  })

  const handleRemove = () => {
    removeCoupon.mutate(undefined, {
      onSuccess: () => toast.success('Cupom removido'),
      onError: (error) => toast.error(error instanceof ApiError ? error.message : 'Não foi possível remover o cupom'),
    })
  }

  const checkoutButton = blocked ? (
    <Button disabled aria-describedby={blockedId} className="h-12 w-full rounded-full md:h-10 md:rounded-sm">
      Finalizar compra
    </Button>
  ) : isAuthenticated ? (
    <Button asChild className="h-12 w-full rounded-full md:h-10 md:rounded-sm">
      <Link to="/checkout">Finalizar compra</Link>
    </Button>
  ) : (
    <Button asChild className="h-12 w-full rounded-full md:h-10 md:rounded-sm">
      <Link to="/login" search={{ redirect: '/checkout' }}>
        Finalizar compra
      </Link>
    </Button>
  )

  return (
    <section
      aria-labelledby="cart-summary-heading"
      className="rounded-2xl bg-card p-4 md:rounded-none md:bg-transparent md:p-0"
    >
      <h2 id="cart-summary-heading" className="border-b border-border pb-3 font-bold">
        Resumo da carteira
      </h2>

      <div className="mt-4">
        {cart.coupon ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border-soft bg-background/40 px-3 py-2">
            <p className="text-sm">
              Cupom <span className="font-bold text-accent-text">{cart.coupon.code}</span> aplicado
              <span className="block text-xs text-muted-foreground">{cart.coupon.percent}% de desconto</span>
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove} disabled={removeCoupon.isPending}>
              {removeCoupon.isPending ? (
                <>
                  <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Removendo…
                </>
              ) : (
                'Remover'
              )}
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={handleApply} className="flex flex-col gap-2">
            <Label htmlFor="coupon-code">Código promocional</Label>
            <div className="flex items-stretch gap-2">
              <Input
                id="coupon-code"
                placeholder="Digite o código promocional…"
                autoComplete="off"
                aria-invalid={Boolean(form.formState.errors.code)}
                aria-describedby={form.formState.errors.code ? codeErrorId : undefined}
                className="h-12 rounded-full md:h-10 md:rounded-sm"
                {...form.register('code')}
              />
              <Button
                type="submit"
                className="h-12 shrink-0 rounded-full px-5 md:h-10 md:rounded-sm"
                disabled={applyCoupon.isPending}
              >
                {applyCoupon.isPending ? (
                  <>
                    <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    Aplicando…
                  </>
                ) : (
                  'Aplicar'
                )}
              </Button>
            </div>
            <FieldError id={codeErrorId} message={form.formState.errors.code?.message} />
          </form>
        )}
      </div>

      <div className="mt-6">
        <SummaryLines summary={cart.summary} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {checkoutButton}
        {blocked && (
          <p id={blockedId} role="alert" className="text-xs text-destructive">
            Remova os itens esgotados ou ajuste as quantidades indisponíveis para finalizar a compra.
          </p>
        )}
        <Link to="/" className="text-center text-sm text-accent-text underline-offset-4 hover:underline">
          Continuar explorando
        </Link>
      </div>
    </section>
  )
}
