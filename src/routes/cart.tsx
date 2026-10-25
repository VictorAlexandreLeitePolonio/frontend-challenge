import { createFileRoute, Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/PageContainer'
import { CartLine } from '@/components/cart/CartLine'
import { CartSkeleton } from '@/components/cart/CartSkeleton'
import { CartSummary } from '@/components/cart/CartSummary'
import { MobileBackLink } from '@/components/cart/MobileBackLink'
import { PageBreadcrumbs } from '@/components/cart/PageBreadcrumbs'
import { RelatedNfts } from '@/components/cart/RelatedNfts'
import { useCart } from '@/hooks/useCart'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const cart = useCart()

  return (
    <PageContainer className="py-8 md:py-10">
      <div className="hidden md:block">
        <PageBreadcrumbs current="Carrinho" />
      </div>

      <header className="mb-6 flex items-center justify-between gap-3 md:hidden">
        <MobileBackLink to="/" label="Voltar ao início" />
        <h1 className="flex-1 text-center text-base font-bold">Carrinho de NFTs</h1>
        <span className="size-9 shrink-0" aria-hidden="true" />
      </header>
      <h1 className="sr-only hidden md:block">Carrinho de NFTs</h1>

      <div aria-busy={cart.isFetching}>
        {cart.isPending && <CartSkeleton />}

        {cart.isError && (
          <ErrorState
            error={cart.error}
            title="Não foi possível carregar o carrinho"
            onRetry={() => void cart.refetch()}
            isRetrying={cart.isFetching}
          />
        )}

        {cart.isSuccess && cart.data.items.length === 0 && (
          <EmptyState
            title="Seu carrinho está vazio"
            description="Explore o catálogo e encontre sua próxima obra digital."
            action={
              <Button asChild>
                <Link to="/" hash="catalogo">
                  Explorar NFTs
                </Link>
              </Button>
            }
          />
        )}

        {cart.isSuccess && cart.data.items.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_332px] lg:gap-x-[86px]">
            <section aria-labelledby="cart-items-heading">
              <h2 id="cart-items-heading" className="sr-only">
                Itens do carrinho
              </h2>
              <div className="hidden grid-cols-[minmax(0,1fr)_100px_150px_120px_40px] gap-4 border-b border-border pb-3 text-sm text-muted-foreground md:grid">
                <span>NFTs</span>
                <span>Preço</span>
                <span>Edições</span>
                <span>Total</span>
                <span className="sr-only">Ações</span>
              </div>
              <ul className="mt-4 flex flex-col gap-3 md:mt-0 md:gap-0">
                {cart.data.items.map((item) => (
                  <CartLine key={item.id} item={item} />
                ))}
              </ul>
            </section>

            <CartSummary cart={cart.data} />
          </div>
        )}
      </div>

      <RelatedNfts />
    </PageContainer>
  )
}
