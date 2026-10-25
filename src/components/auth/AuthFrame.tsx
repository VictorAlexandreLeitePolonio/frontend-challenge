import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { HeroBanner } from '@/components/catalog/HeroBanner'
import { PageContainer } from '@/components/layout/PageContainer'
import { AuthTabs } from './AuthTabs'
import { SocialAuth } from './SocialAuth'
import { safeRedirect } from './safe-redirect'
import { useIsDesktop } from './useIsDesktop'

interface AuthFrameProps {
  mode: 'login' | 'signup'
  redirect?: string
  dialogTitle: string
  mobileTitle: string
  subtitle: string
  footer: React.ReactNode
  children: React.ReactNode
}

export function AuthFrame({ mode, redirect, dialogTitle, mobileTitle, subtitle, footer, children }: AuthFrameProps) {
  const isDesktop = useIsDesktop()
  const navigate = useNavigate()

  const close = () => void navigate({ href: safeRedirect(redirect), replace: true })

  if (!isDesktop) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-background md:hidden">
        <div className="mx-auto flex min-h-full w-full max-w-[480px] flex-col px-7 pt-20 pb-10">
          <p className="text-center text-[40px] leading-[42px] font-bold tracking-[0.08em]">KURIO</p>
          <h1 className="mt-14 text-center text-base font-bold">{mobileTitle}</h1>
          <div className="mt-8">{children}</div>
          <SocialAuth className="mt-10" />
          <div className="mt-auto pt-10 text-center text-sm">{footer}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div aria-hidden="true" inert className="hidden pb-10 md:block">
        <PageContainer className="pt-8">
          <HeroBanner />
        </PageContainer>
      </div>
      <Dialog open onOpenChange={(open) => !open && close()}>
        <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] max-w-[500px] gap-0 overflow-y-auto rounded-none border-0 bg-card p-0 text-foreground ring-0 sm:max-w-[500px]">
          <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
          <DialogClose asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Fechar" className="absolute top-3 right-3 z-10">
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
          <div className="px-12 pt-12 pb-8">
            <AuthTabs mode={mode} redirect={redirect} />
            <DialogDescription className="mt-6 text-center text-sm leading-5 text-muted-foreground">{subtitle}</DialogDescription>
            <div className="mt-6">{children}</div>
            <SocialAuth className="mt-8" />
          </div>
          <div className="h-2.5 w-full bg-primary" aria-hidden="true" />
        </DialogContent>
      </Dialog>
    </>
  )
}
