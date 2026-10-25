import { cn } from '@/lib/utils'

interface ComingSoonProps {
  children: React.ReactNode
  className?: string
}

/** Ação fora do escopo do desafio: visível, mas claramente indisponível (nunca simula sucesso). */
export function ComingSoon({ children, className }: ComingSoonProps) {
  return (
    <span aria-disabled="true" title="Em breve" className={cn('relative cursor-not-allowed opacity-60', className)}>
      {children}
      <span className="sr-only"> (em breve)</span>
    </span>
  )
}
