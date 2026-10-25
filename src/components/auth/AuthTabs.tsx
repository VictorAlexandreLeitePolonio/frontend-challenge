import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

interface AuthTabsProps {
  mode: 'login' | 'signup'
  redirect?: string
}

const tab = 'border-b-2 border-transparent pb-1 text-base tracking-wide transition-colors hover:text-accent-text'
const activeTab = 'border-primary font-bold text-primary'

export function AuthTabs({ mode, redirect }: AuthTabsProps) {
  return (
    <nav aria-label="Acesso à conta" className="flex items-center justify-center gap-3">
      <Link
        to="/login"
        search={{ redirect }}
        aria-current={mode === 'login' ? 'page' : undefined}
        className={cn(tab, mode === 'login' && activeTab, mode !== 'login' && 'text-foreground')}
      >
        Entrar
      </Link>
      <span className="h-5 w-px bg-border-soft" aria-hidden="true" />
      <Link
        to="/signup"
        search={{ redirect }}
        aria-current={mode === 'signup' ? 'page' : undefined}
        className={cn(tab, mode === 'signup' && activeTab, mode !== 'signup' && 'text-foreground')}
      >
        Criar conta
      </Link>
    </nav>
  )
}
