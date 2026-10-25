import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { DevPanel } from '@/components/layout/DevPanel'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { clearSession } from '@/hooks/useSession'
import { sessionEvents } from '@/lib/session-events'
import { useRealtimeSync } from '@/realtime/useRealtimeSync'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  useRealtimeSync()
  useSessionExpiry()

  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="min-h-[60vh] pb-28 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
      <Toaster position="top-right" richColors closeButton />
      <DevPanel />
    </>
  )
}

/** Sessão expirada em qualquer request: limpa dados privados e, se a tela é privada, volta ao login preservando o destino. */
function useSessionExpiry() {
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(
    () =>
      sessionEvents.onExpired(() => {
        clearSession(queryClient)
        toast.warning('Sua sessão expirou. Entre novamente para continuar.')
        const isPrivate = router.state.matches.some((match) => match.routeId.startsWith('/_auth'))
        if (isPrivate) void router.navigate({ to: '/login', search: { redirect: router.state.location.href } })
      }),
    [queryClient, router],
  )
}

function NotFound() {
  return (
    <PageContainer className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground">O endereço acessado não existe ou foi removido.</p>
      <Button asChild>
        <Link to="/">Voltar ao início</Link>
      </Button>
    </PageContainer>
  )
}
