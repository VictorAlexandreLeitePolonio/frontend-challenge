import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '@/components/layout/PageContainer'

export const Route = createFileRoute('/_auth/checkout')({
  component: Page,
})

// Placeholder da fundação: tela implementada pelos agentes (docs/superpowers/plans/2026-10-25-agents.md).
function Page() {
  return (
    <PageContainer className="py-12">
      <h1 className="text-2xl font-bold">Pagamento</h1>
      <p className="text-muted-foreground">Em construção.</p>
    </PageContainer>
  )
}
