import { useLocation, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AuthModeLink, AuthTabs, type AuthMode } from './AuthTabs'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { publicRedirect, safeRedirect } from './safe-redirect'
import { SocialAuth } from './SocialAuth'
import { useIsDesktop } from './useIsDesktop'

const AUTH_PATH_MODES: Record<string, AuthMode> = { '/login': 'login', '/signup': 'signup' }

/** Modo do diálogo quando a própria rota é de auth (/login e /signup). */
export function authPathMode(pathname: string): AuthMode | undefined {
  return AUTH_PATH_MODES[pathname]
}

/** Tira só `auth` do href atual: o search tipado da rota da página não conhece esse parâmetro. */
function withoutAuth(href: string): string {
  const url = new URL(href, 'http://localhost')
  url.searchParams.delete('auth')
  return url.pathname + url.search + url.hash
}

const COPY: Record<AuthMode, { title: string; mobileTitle: string; subtitle: string }> = {
  login: {
    title: 'Entrar na Kurio',
    mobileTitle: 'Entrar',
    subtitle: 'Entre para gerenciar sua carteira, coleção e perfil de criador.',
  },
  signup: {
    title: 'Criar conta na Kurio',
    mobileTitle: 'Criar perfil de colecionador',
    subtitle: 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.',
  },
}

/** Altura fixa do modal desktop no Figma (login 600px, cadastro 656px). */
const DESKTOP_HEIGHT: Record<AuthMode, string> = { login: 'min-h-[600px]', signup: 'min-h-[656px]' }

interface AuthDialogProps {
  mode: AuthMode
  redirect?: string
}

/** Diálogo de auth sobre a página atual (overlay escuro, sem blur). Renderizado pela raiz. */
export function AuthDialog({ mode, redirect }: AuthDialogProps) {
  const navigate = useNavigate()
  const pathname = useLocation({ select: (location) => location.pathname })
  const href = useLocation({ select: (location) => location.href })
  const isDesktop = useIsDesktop()
  const onAuthPath = authPathMode(pathname) !== undefined
  const copy = COPY[mode]

  const dropAuth = () => navigate({ href: withoutAuth(href), replace: true })
  // Em /login e /signup o diálogo é a própria página: sair nunca cai numa rota protegida (evita loop com o guard).
  const close = () => (onAuthPath ? navigate({ href: publicRedirect(redirect), replace: true }) : dropAuth())
  // Depois de logar: vai ao destino quando há redirect ou se estava numa rota de auth; senão só tira ?auth.
  const finish = () => (redirect || onAuthPath ? navigate({ href: safeRedirect(redirect), replace: true }) : dropAuth())

  const form = mode === 'login' ? <LoginForm onSuccess={finish} /> : <SignupForm onSuccess={finish} />

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => !open && close()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 flex flex-col overflow-y-auto bg-card text-foreground outline-none',
            isDesktop
              ? cn('top-1/2 left-1/2 max-h-[calc(100dvh-2rem)] w-[500px] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2', DESKTOP_HEIGHT[mode])
              : 'inset-0 h-dvh bg-background',
          )}
        >
          <DialogPrimitive.Title className="sr-only">{copy.title}</DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Fechar" className="absolute top-2 right-2 z-10 text-primary hover:bg-transparent hover:text-primary">
              <X className="size-[18px]" aria-hidden="true" />
            </Button>
          </DialogPrimitive.Close>

          {isDesktop ? (
            <>
              <div className="flex flex-1 flex-col px-12 pt-12">
                <AuthTabs mode={mode} />
                <DialogPrimitive.Description className="mt-10 text-center text-[13px] leading-4 text-muted-foreground">{copy.subtitle}</DialogPrimitive.Description>
                <div className="mt-6">{form}</div>
                <SocialAuth className="mt-6" />
              </div>
              <div className="h-2.5 w-full bg-primary" aria-hidden="true" />
            </>
          ) : (
            <div className="mx-auto flex min-h-full w-full max-w-[480px] flex-col px-7 pt-[127px] pb-10">
              <p className="text-center text-[36px] leading-[42px] font-bold">KURIO</p>
              <h1 className="mt-[87px] text-center text-lg leading-4 font-bold">{copy.mobileTitle}</h1>
              <div className="mt-10">{form}</div>
              <SocialAuth className="mt-10 gap-4" />
              <p className="mt-10 text-center text-[15px]">
                {mode === 'login' ? (
                  <>
                    Novo na Kurio?{' '}
                    <AuthModeLink mode="signup" className="text-accent-text hover:underline">
                      Crie uma conta
                    </AuthModeLink>
                  </>
                ) : (
                  <>
                    Já tem uma conta?{' '}
                    <AuthModeLink mode="login" className="text-accent-text hover:underline">
                      Entre
                    </AuthModeLink>
                  </>
                )}
              </p>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
