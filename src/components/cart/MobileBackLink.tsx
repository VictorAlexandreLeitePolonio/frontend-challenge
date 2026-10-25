import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileBackLinkProps {
  to: '/' | '/cart'
  label: string
  className?: string
}

/** Botão circular de voltar do cabeçalho mobile (o layout raiz não tem header no mobile). */
export function MobileBackLink({ to, label, className }: MobileBackLinkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-full bg-card text-foreground transition-colors hover:text-accent-text',
        className,
      )}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
    </Link>
  )
}
