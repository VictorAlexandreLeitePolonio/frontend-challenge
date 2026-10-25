import { createFileRoute } from '@tanstack/react-router'
import { AuthBackdrop } from '@/components/auth/AuthBackdrop'
import { redirectSearchSchema } from '@/lib/redirect'

/** O diálogo de login é renderizado pela raiz; esta rota só mostra a página atrás dele. */
export const Route = createFileRoute('/login')({
  validateSearch: redirectSearchSchema,
  component: AuthBackdrop,
})
