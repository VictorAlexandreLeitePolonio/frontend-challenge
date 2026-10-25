import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SocialAuthProps {
  className?: string
}

export function SocialAuth({ className }: SocialAuthProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        <span>Ou continue com</span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <Button type="button" variant="outline" disabled className="h-11 w-full justify-center gap-3 rounded-sm border-border-soft text-foreground">
        <span aria-hidden="true" className="font-bold text-accent-text">G</span>
        Continuar com Google
        <span className="text-[10px] font-normal tracking-wide text-muted-foreground uppercase">Em breve</span>
      </Button>
      <Button type="button" variant="outline" disabled className="h-11 w-full justify-center gap-3 rounded-sm border-border-soft text-foreground">
        <span aria-hidden="true" className="font-bold text-accent-text">f</span>
        Continuar com Facebook
        <span className="text-[10px] font-normal tracking-wide text-muted-foreground uppercase">Em breve</span>
      </Button>
    </div>
  )
}
