import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '@/components/layout/PageContainer'
import { redirectSearchSchema } from '@/lib/redirect'
export const Route = createFileRoute('/signup')({
  validateSearch: redirectSearchSchema,
  component: Page,
})

// Placeholder da fundação: tela implementada pelos agentes (docs/superpowers/plans/2026-10-25-agents.md).
function Page() {
  return (
    <PageContainer className="py-12">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <p className="text-muted-foreground">Em construção.</p>
    </PageContainer>
  )
}
